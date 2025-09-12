// auth/decorators/auth-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  AuthRequest,
  AuthenticatedUser as AuthUserType,
} from '../guards/auth-token.guard';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUserType => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();
    return req.user!;
  },
);
