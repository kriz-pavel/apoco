import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthTokenGuard } from './auth-token.guard';
import { AuthService } from '../auth.service';
import type { AuthRequest } from './auth-token.guard';
import { Token } from '../entities/token.entity';

/* eslint-disable @typescript-eslint/unbound-method */

describe('AuthTokenGuard', () => {
  let guard: AuthTokenGuard;
  let authService: jest.Mocked<AuthService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
  };

  const mockValidToken = {
    id: 1,
    user: mockUser,
    tokenHash: 'hashed-token',
    isRevoked: false,
    expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Token;

  beforeEach(async () => {
    const mockAuthService = {
      getTokenRecord: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthTokenGuard,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    guard = module.get<AuthTokenGuard>(AuthTokenGuard);
    authService = module.get<AuthService>(
      AuthService,
    ) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (
    queryParams: Record<string, unknown> = {},
    headers: Record<string, string> = {},
  ): ExecutionContext => {
    const mockRequest = {
      query: queryParams,
      header: jest.fn((name: string) => headers[name] || ''),
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  };

  describe('canActivate - Favorites Parameter Logic', () => {
    it('should return true (bypass authentication) when favorites parameter is not "true" (string)', async () => {
      // Arrange
      const context = createMockExecutionContext({ favorites: 'false' });

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(authService.getTokenRecord).not.toHaveBeenCalled();
    });

    it('should return true (bypass authentication) when favorites parameter is not provided', async () => {
      // Arrange
      const context = createMockExecutionContext({});

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(authService.getTokenRecord).not.toHaveBeenCalled();
    });

    it('should return true (bypass authentication) when favorites parameter is empty string', async () => {
      // Arrange
      const context = createMockExecutionContext({ favorites: '' });

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(authService.getTokenRecord).not.toHaveBeenCalled();
    });

    it('should proceed to token validation when favorites parameter is "true"', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { favorites: 'true' },
        { authorization: 'Bearer valid-token' },
      );
      authService.getTokenRecord.mockResolvedValue(mockValidToken);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(authService.getTokenRecord).toHaveBeenCalledWith('valid-token');
    });

    it('should throw UnauthorizedException when array favorites parameter is provided but without authorization header', async () => {
      // Arrange
      const context = createMockExecutionContext({
        favorites: ['true', 'false'],
      });

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException(),
      );
    });

    it('should proceed to token validation when array favorites parameter is provided with authorization header', async () => {
      // Arrange
      const context = createMockExecutionContext(
        {
          favorites: ['true', 'false'],
        },
        { authorization: 'Bearer valid-token' },
      );
      authService.getTokenRecord.mockResolvedValue(mockValidToken);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(authService.getTokenRecord).toHaveBeenCalledWith('valid-token');
    });

    it('should return true (bypass authentication) when array favorites parameter is provided with first element not "true"', async () => {
      // Arrange
      const context = createMockExecutionContext({
        favorites: ['false', 'true'],
      });

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(authService.getTokenRecord).not.toHaveBeenCalled();
    });

    it('should proceed to token validation when case insensitive "true" values are provided', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { favorites: 'TRUE' },
        { authorization: 'Bearer valid-token' },
      );
      authService.getTokenRecord.mockResolvedValue(mockValidToken);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(authService.getTokenRecord).toHaveBeenCalledWith('valid-token');
    });
  });

  describe('canActivate - Authorization Header Validation', () => {
    it('should throw UnauthorizedException when authorization header is missing', async () => {
      // Arrange
      const context = createMockExecutionContext({ favorites: 'true' });

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException(),
      );
      expect(authService.getTokenRecord).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when authorization header is empty string', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { favorites: 'true' },
        { authorization: '' },
      );

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException(),
      );
      expect(authService.getTokenRecord).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when scheme is not "Bearer"', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { favorites: 'true' },
        { authorization: 'Basic some-token' },
      );

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException(),
      );
      expect(authService.getTokenRecord).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token is missing after Bearer', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { favorites: 'true' },
        { authorization: 'Bearer ' },
      );

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException(),
      );
      expect(authService.getTokenRecord).not.toHaveBeenCalled();
    });
  });

  describe('canActivate - Token Validation', () => {
    it('should successfully validate token and set user in request', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { favorites: 'true' },
        { authorization: 'Bearer valid-token' },
      );
      authService.getTokenRecord.mockResolvedValue(mockValidToken);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(authService.getTokenRecord).toHaveBeenCalledWith('valid-token');

      const request = context.switchToHttp().getRequest<AuthRequest>();
      expect(request.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
      });
      expect(request.authTokenId).toBe(mockValidToken.id);
    });

    it('should throw UnauthorizedException when token validation fails', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { favorites: 'true' },
        { authorization: 'Bearer invalid-token' },
      );
      authService.getTokenRecord.mockResolvedValue(null);

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException(),
      );
      expect(authService.getTokenRecord).toHaveBeenCalledWith('invalid-token');
    });

    it('should throw when token validation service errors', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { favorites: 'true' },
        { authorization: 'Bearer some-token' },
      );
      authService.getTokenRecord.mockRejectedValue(new Error());

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow();
      expect(authService.getTokenRecord).toHaveBeenCalledWith('some-token');
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete happy path scenario', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { favorites: 'true' },
        { authorization: 'Bearer valid-jwt-token' },
      );
      authService.getTokenRecord.mockResolvedValue(mockValidToken);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(authService.getTokenRecord).toHaveBeenCalledTimes(1);
      expect(authService.getTokenRecord).toHaveBeenCalledWith(
        'valid-jwt-token',
      );

      const request = context.switchToHttp().getRequest<AuthRequest>();
      expect(request.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
      });
      expect(request.authTokenId).toBe(mockValidToken.id);
    });

    it('should bypass authentication for non-favorites requests', async () => {
      // Arrange - regular request without favorites=true
      const context = createMockExecutionContext(
        { page: 1, limit: 20 },
        {}, // no authorization header needed
      );

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(authService.getTokenRecord).not.toHaveBeenCalled();

      const request = context.switchToHttp().getRequest<AuthRequest>();
      expect(request.user).toBeUndefined();
      expect(request.authTokenId).toBeUndefined();
    });

    it('should throw UnauthorizedException when malformed token', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { favorites: 'true' },
        { authorization: 'Bearer malformed.jwt.token' },
      );
      authService.getTokenRecord.mockResolvedValue(null);

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException(),
      );
    });

    it('should proceed to token validation when whitespace in authorization header', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { favorites: 'true' },
        { authorization: '  Bearer   valid-token  ' },
      );
      authService.getTokenRecord.mockResolvedValue(mockValidToken);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(authService.getTokenRecord).toHaveBeenCalledWith('valid-token');
    });
  });
});
