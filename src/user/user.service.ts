import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Token } from '../auth/entities/token.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: EntityRepository<Token>,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = this.userRepository.create(createUserDto);
    const token = this.authService.generateToken();
    const tokenEntity = this.tokenRepository.create({
      tokenHash: this.authService.hashToken(token),
      user,
      expiresAt: this.authService.getTokenExpirationTime(),
    });
    tokenEntity.user = user;

    await this.tokenRepository.getEntityManager().persistAndFlush(tokenEntity);
    await this.userRepository.getEntityManager().persistAndFlush(user);

    return {
      token,
    };
  }
}
