import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  EntityManager,
  LockMode,
} from '@mikro-orm/postgresql';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Token } from './entities/token.entity';
import { RotateTokenDto } from './dto/rotate-token.dto';
import { User } from '../users/entities/user.entity';
import * as crypto from 'crypto';
import { TOKEN_EXPIRATION_TIME } from './auth.service';

/* eslint-disable @typescript-eslint/unbound-method */

describe('AuthService', () => {
  let service: AuthService;
  let tokenRepository: jest.Mocked<EntityRepository<Token>>;
  let entityManager: jest.Mocked<EntityManager>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
  } as unknown as User;

  const mockToken = {
    id: 1,
    tokenHash: 'hashed-token',
    user: mockUser,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
    isRevoked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Token;

  const mockRevokedToken = {
    ...mockToken,
    id: 2,
    isRevoked: true,
  } as unknown as Token;

  const mockExpiredToken = {
    ...mockToken,
    id: 3,
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  } as unknown as Token;

  beforeEach(async () => {
    const mockTokenRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      getEntityManager: jest.fn(),
    } as unknown as jest.Mocked<EntityRepository<Token>>;

    const mockEntityManager = {
      transactional: jest.fn(),
      findOne: jest.fn(),
      persistAndFlush: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Token),
          useValue: mockTokenRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    tokenRepository = module.get<EntityRepository<Token>>(
      getRepositoryToken(Token),
    ) as jest.Mocked<EntityRepository<Token>>;

    entityManager = mockEntityManager;
    tokenRepository.getEntityManager.mockReturnValue(entityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rotateToken', () => {
    const rotateTokenDto: RotateTokenDto = {
      token: 'original-token',
    };

    it('should successfully rotate a valid token', async () => {
      // Arrange
      const newToken = 'new-generated-token';
      const hashedOriginalToken = service.hashToken(rotateTokenDto.token);
      const hashedNewToken = service.hashToken(newToken);

      // Act
      // Mock the transaction
      entityManager.transactional.mockImplementation((callback) => {
        return Promise.resolve(callback(entityManager));
      });

      // Mock finding the original token
      entityManager.findOne.mockResolvedValue(mockToken);

      // Mock token generation
      jest.spyOn(service, 'generateToken').mockReturnValue(newToken);

      // Mock creating new token
      const newTokenEntity = { ...mockToken, tokenHash: hashedNewToken };
      tokenRepository.create.mockReturnValue(newTokenEntity as Token);

      // Act
      const result = await service.rotateToken(rotateTokenDto);

      // Assert
      expect(result).toEqual({ token: newToken });
      expect(entityManager.transactional).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(entityManager.findOne).toHaveBeenCalledWith(
        Token,
        { tokenHash: hashedOriginalToken },
        { lockMode: LockMode.PESSIMISTIC_WRITE },
      );
      expect(mockToken.isRevoked).toBe(true);
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith(mockToken);
      expect(tokenRepository.create).toHaveBeenCalledWith({
        tokenHash: hashedNewToken,
        expiresAt: expect.any(Date) as Date,
        user: mockUser,
      });
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith(
        newTokenEntity,
      );
    });

    it('should throw UnauthorizedException when token is not found', async () => {
      // Arrange
      entityManager.transactional.mockImplementation((callback) => {
        return Promise.resolve(callback(entityManager));
      });
      entityManager.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.rotateToken(rotateTokenDto)).rejects.toThrow(
        new UnauthorizedException(),
      );

      expect(entityManager.findOne).toHaveBeenCalledWith(
        Token,
        { tokenHash: service.hashToken(rotateTokenDto.token) },
        { lockMode: LockMode.PESSIMISTIC_WRITE },
      );
    });

    it('should throw UnauthorizedException when token is revoked', async () => {
      // Arrange
      entityManager.transactional.mockImplementation((callback) => {
        return Promise.resolve(callback(entityManager));
      });
      entityManager.findOne.mockResolvedValue(mockRevokedToken);

      // Act & Assert
      await expect(service.rotateToken(rotateTokenDto)).rejects.toThrow(
        new UnauthorizedException(),
      );

      // Assert
      expect(entityManager.findOne).toHaveBeenCalledWith(
        Token,
        { tokenHash: service.hashToken(rotateTokenDto.token) },
        { lockMode: LockMode.PESSIMISTIC_WRITE },
      );
    });

    it('should throw UnauthorizedException when token is expired', async () => {
      // Arrange
      entityManager.transactional.mockImplementation((callback) => {
        return Promise.resolve(callback(entityManager));
      });
      entityManager.findOne.mockResolvedValue(mockExpiredToken);

      // Act & Assert
      await expect(service.rotateToken(rotateTokenDto)).rejects.toThrow(
        new UnauthorizedException(),
      );

      // Assert
      expect(entityManager.findOne).toHaveBeenCalledWith(
        Token,
        { tokenHash: service.hashToken(rotateTokenDto.token) },
        { lockMode: LockMode.PESSIMISTIC_WRITE },
      );
    });
  });

  describe('getTokenRecord', () => {
    const tokenString = 'valid-token';

    it('should return valid token when token exists and is not expired or revoked', async () => {
      // Arrange
      const hashedToken = service.hashToken(tokenString);
      tokenRepository.findOne.mockResolvedValue(mockToken);

      // Act
      const result = await service.getTokenRecord(tokenString);

      // Assert
      expect(result).toBe(mockToken);
      expect(tokenRepository.findOne).toHaveBeenCalledWith(
        {
          tokenHash: hashedToken,
          isRevoked: false,
        },
        { populate: ['user'] },
      );
    });

    it('should return null when token is not found', async () => {
      const hashedToken = service.hashToken(tokenString);
      tokenRepository.findOne.mockResolvedValue(null);

      const result = await service.getTokenRecord(tokenString);

      expect(result).toBeNull();
      expect(tokenRepository.findOne).toHaveBeenCalledWith(
        {
          tokenHash: hashedToken,
          isRevoked: false,
        },
        { populate: ['user'] },
      );
    });

    it('should return null when token is expired', async () => {
      const expiredToken = {
        ...mockToken,
        expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      } as Token;

      const hashedToken = service.hashToken(tokenString);
      tokenRepository.findOne.mockResolvedValue(expiredToken);

      const result = await service.getTokenRecord(tokenString);

      expect(result).toBeNull();
      expect(tokenRepository.findOne).toHaveBeenCalledWith(
        {
          tokenHash: hashedToken,
          isRevoked: false,
        },
        { populate: ['user'] },
      );
    });
  });

  describe('generateToken', () => {
    it('should generate a 64-character hex string', () => {
      const token = service.generateToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token).toHaveLength(64);
      expect(token).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate unique tokens on multiple calls', () => {
      const token1 = service.generateToken();
      const token2 = service.generateToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('hashToken', () => {
    it('should create SHA256 hash of the token', () => {
      const token = 'test-token';
      const expectedHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const hash = service.hashToken(token);

      expect(hash).toBe(expectedHash);
    });

    it('should produce consistent hashes for the same input', () => {
      const token = 'consistent-token';

      const hash1 = service.hashToken(token);
      const hash2 = service.hashToken(token);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const token1 = 'token-one';
      const token2 = 'token-two';

      const hash1 = service.hashToken(token1);
      const hash2 = service.hashToken(token2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('getTokenExpirationTime', () => {
    it('should return date 30 days from now', () => {
      const mockNow = 1640995200000; // 2022-01-01 00:00:00
      const expectedExpiration = mockNow + TOKEN_EXPIRATION_TIME; // 30 days later

      jest.spyOn(Date, 'now').mockReturnValue(mockNow);

      const expiration = service.getTokenExpirationTime();

      expect(expiration).toBeInstanceOf(Date);
      expect(expiration.getTime()).toBe(expectedExpiration);

      // Restore Date.now
      (Date.now as jest.Mock).mockRestore();
    });
  });
});
