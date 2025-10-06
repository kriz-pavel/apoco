import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { BadRequestException } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { Token } from '../auth/entities/token.entity';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';

/* eslint-disable @typescript-eslint/unbound-method */

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<EntityRepository<User>>;
  let authService: jest.Mocked<AuthService>;
  let entityManager: jest.Mocked<EntityManager>;

  const mockCreateUserDto: CreateUserDto = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as User;

  const mockToken = {
    id: 1,
    tokenHash: 'hashed-token',
    user: mockUser,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    isRevoked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Token;

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      getEntityManager: jest.fn(),
    } as unknown as jest.Mocked<EntityRepository<User>>;

    const mockAuthService = {
      generateToken: jest.fn(),
      hashToken: jest.fn(),
      getTokenExpirationTime: jest.fn(),
      validateToken: jest.fn(),
      rotateToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const mockEntityManager = {
      transactional: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
      persistAndFlush: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<EntityRepository<User>>(
      getRepositoryToken(User),
    ) as jest.Mocked<EntityRepository<User>>;
    authService = module.get<AuthService>(
      AuthService,
    ) as jest.Mocked<AuthService>;

    entityManager = mockEntityManager;
    userRepository.getEntityManager.mockReturnValue(entityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a new user with token', async () => {
      // Arrange
      const generatedToken = 'generated-token-string';
      const hashedToken = 'hashed-token-value';
      const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne.mockResolvedValue(null); // No existing user
      entityManager.create
        .mockReturnValueOnce(mockUser) // Create user
        .mockReturnValueOnce(mockToken); // Create token

      authService.generateToken.mockReturnValue(generatedToken);
      authService.hashToken.mockReturnValue(hashedToken);
      authService.getTokenExpirationTime.mockReturnValue(expirationDate);

      // Act
      const result = await service.create(mockCreateUserDto);

      // Assert
      expect(result).toEqual({
        user: {
          name: mockCreateUserDto.name,
          email: mockCreateUserDto.email,
        },
        token: generatedToken,
      });

      // Check persistence
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith([
        mockUser,
        mockToken,
      ]);
    });

    it('should throw BadRequestException when user already exists', async () => {
      // Arrange
      const existingUser = {
        id: 2,
        name: 'Existing User',
        email: mockCreateUserDto.email,
      } as User;

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(service.create(mockCreateUserDto)).rejects.toThrow(
        new BadRequestException('User already exists'),
      );
      expect(entityManager.create).not.toHaveBeenCalled();
      expect(entityManager.persistAndFlush).not.toHaveBeenCalled();
    });

    it('should handle transactional failures', async () => {
      // Arrange
      entityManager.transactional.mockRejectedValue(
        new Error('Transactional failed'),
      );

      // Act & Assert
      await expect(service.create(mockCreateUserDto)).rejects.toThrow();
    });

    it('should handle auth service errors during token generation', async () => {
      // Arrange
      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne.mockResolvedValue(null);
      entityManager.create.mockReturnValueOnce(mockUser);

      const tokenError = new Error('Token generation failed');
      authService.generateToken.mockImplementation(() => {
        throw tokenError;
      });

      // Act & Assert
      await expect(service.create(mockCreateUserDto)).rejects.toThrow();
      expect(authService.generateToken).toHaveBeenCalledTimes(1);
    });

    it('should handle persistence errors', async () => {
      // Arrange
      const generatedToken = 'generated-token-string';
      const hashedToken = 'hashed-token-value';
      const expirationDate = new Date();

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne.mockResolvedValue(null);
      entityManager.create
        .mockReturnValueOnce(mockUser)
        .mockReturnValueOnce(mockToken);

      authService.generateToken.mockReturnValue(generatedToken);
      authService.hashToken.mockReturnValue(hashedToken);
      authService.getTokenExpirationTime.mockReturnValue(expirationDate);

      entityManager.persistAndFlush.mockRejectedValue(new Error());

      // Act & Assert
      await expect(service.create(mockCreateUserDto)).rejects.toThrow();
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith([
        mockUser,
        mockToken,
      ]);
    });

    it('should handle edge cases with empty/invalid data', async () => {
      // Arrange
      const invalidUserDto = {
        name: '',
        email: 'invalid-email',
      } as CreateUserDto;

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne.mockResolvedValue(null);

      // Act & Assert - Service should still process, validation happens at controller level
      const invalidUser = {
        ...mockUser,
        name: invalidUserDto.name,
        email: invalidUserDto.email,
      };
      entityManager.create
        .mockReturnValueOnce(invalidUser)
        .mockReturnValueOnce(mockToken);
      authService.generateToken.mockReturnValue('token');
      authService.hashToken.mockReturnValue('hash');
      authService.getTokenExpirationTime.mockReturnValue(new Date());

      const result = await service.create(invalidUserDto);

      expect(result).toEqual({
        user: {
          name: invalidUserDto.name,
          email: invalidUserDto.email,
        },
        token: 'token',
      });
      expect(entityManager.findOne).toHaveBeenCalledWith(User, {
        email: invalidUserDto.email,
      });
    });

    it('should create user and token with correct relationships', async () => {
      // Arrange
      const generatedToken = 'test-token-123';
      const hashedToken = 'hashed-test-token-123';
      const expirationDate = new Date('2024-12-31');

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne.mockResolvedValue(null);
      entityManager.create.mockImplementation((EntityClass, data) => {
        if (EntityClass === User) {
          return { ...mockUser, ...data } as User;
        }
        if (EntityClass === Token) {
          return { ...mockToken, ...data } as Token;
        }
        return {} as Token & User;
      });

      authService.generateToken.mockReturnValue(generatedToken);
      authService.hashToken.mockReturnValue(hashedToken);
      authService.getTokenExpirationTime.mockReturnValue(expirationDate);

      // Act
      const result = await service.create(mockCreateUserDto);

      // Assert
      expect(result).toEqual({
        user: {
          name: mockCreateUserDto.name,
          email: mockCreateUserDto.email,
        },
        token: generatedToken,
      });

      // Verify the token entity is created with the correct user relationship
      const tokenCreateCall = (entityManager.create as jest.Mock).mock
        .calls[1] as [
        typeof Token,
        {
          user: User;
          tokenHash: string;
          expiresAt: Date;
        },
      ];
      expect(tokenCreateCall).toEqual([
        Token,
        {
          user: expect.objectContaining({
            name: mockCreateUserDto.name,
            email: mockCreateUserDto.email,
          }) as User,
          tokenHash: hashedToken,
          expiresAt: expirationDate,
        },
      ]);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete user registration flow', async () => {
      // Arrange - Full flow simulation
      const userData = {
        name: 'Alice Smith',
        email: 'alice.smith@test.com',
      };

      const aliceUser = { ...mockUser, ...userData };
      const aliceToken = { ...mockToken, tokenHash: 'hashed-alice-token' };

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne.mockResolvedValue(null);
      entityManager.create
        .mockReturnValueOnce(aliceUser)
        .mockReturnValueOnce(aliceToken);

      authService.generateToken.mockReturnValue('alice-token-456');
      authService.hashToken.mockReturnValue('hashed-alice-token');
      authService.getTokenExpirationTime.mockReturnValue(
        new Date('2024-06-01'),
      );

      // Act
      const result = await service.create(userData);

      // Assert
      expect(result).toEqual({
        user: {
          name: userData.name,
          email: userData.email,
        },
        token: 'alice-token-456',
      });
      expect(entityManager.transactional).toHaveBeenCalledTimes(1);
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith([
        aliceUser,
        aliceToken,
      ]);
    });

    it('should handle concurrent user creation attempts', async () => {
      // Arrange - Simulate user already exists during the check
      entityManager.transactional.mockImplementation(() => {
        return Promise.reject(new Error());
      });

      // User already exists when we check
      entityManager.findOne.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.create(mockCreateUserDto)).rejects.toThrow();
      expect(entityManager.create).not.toHaveBeenCalled();
    });
  });
});
