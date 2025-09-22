// auth/guards/auth-token.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { Token } from '../entities/token.entity';

export interface AuthenticatedUser {
  id: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
  authTokenId?: number;
}

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();
    const favoritesParam = Array.isArray(req.query.favorites)
      ? req.query.favorites[0]
      : (req.query.favorites ?? '');
    const shouldCheckBearerToken =
      typeof favoritesParam === 'string' &&
      favoritesParam.toLowerCase() === 'true';

    if (!shouldCheckBearerToken) {
      return true;
    }

    const header = req.header('authorization') || '';
    const [scheme, token] = header.trim().replace(/  +/g, ' ').split(' ');

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException();
    }

    let validToken: Token | null = null;
    try {
      validToken = await this.authService.getTokenRecord(token);
    } catch {
      throw new ServiceUnavailableException();
    }

    if (!validToken) {
      throw new UnauthorizedException();
    }

    req.user = {
      id: validToken.user.id,
      email: validToken.user.email,
    };
    req.authTokenId = validToken.id;
    return true;
  }
}
