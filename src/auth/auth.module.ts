import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Token } from './entities/token.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthTokenGuard } from './guards/auth-token.guard';

@Module({
  imports: [MikroOrmModule.forFeature([Token])],
  controllers: [AuthController],
  providers: [AuthService, AuthTokenGuard],
  exports: [AuthService, AuthTokenGuard],
})
export class AuthModule {}
