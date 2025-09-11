import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { Token } from '../auth/entities/token.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MikroOrmModule.forFeature([User, Token]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
