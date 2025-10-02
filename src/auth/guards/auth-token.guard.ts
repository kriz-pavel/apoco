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
    const isFavoriteEndpoint = req.url?.includes('/me/');
    const shouldCheckBearerToken =
      isFavoriteEndpoint ||
      (typeof favoritesParam === 'string' &&
        favoritesParam.toLowerCase() === 'true');
    console.log('jeste pred?', shouldCheckBearerToken);
    if (!shouldCheckBearerToken) {
      console.log('ono to vyskočí?');
      return true;
    }

    const header = req.header('Authorization') || '';
    const [scheme, token] = header.trim().replace(/  +/g, ' ').split(' ');
    console.log(scheme?.toLowerCase(), token, header, 'to už tady xxx??');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      console.log(scheme?.toLowerCase(), token, header, 'to už tady??');
      throw new UnauthorizedException();
    }

    const validToken = await this.authService.getTokenRecord(token);
    if (!validToken) {
      console.log(
        validToken,
        token,
        scheme?.toLowerCase(),
        header,
        'validToken',
      );
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
