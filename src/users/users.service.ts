import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Token } from '../auth/entities/token.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.userRepository
        .getEntityManager()
        .transactional(async (em) => {
          await this.checkIfUserExists(em, createUserDto.email);

          const user = em.create(User, createUserDto);
          const token = this.authService.generateToken();
          const tokenEntity = em.create(Token, {
            user,
            tokenHash: this.authService.hashToken(token),
            expiresAt: this.authService.getTokenExpirationTime(),
          });

          await em.persistAndFlush([user, tokenEntity]);

          return {
            user: {
              name: user.name,
              email: user.email,
            },
            token,
          };
        });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new ServiceUnavailableException();
    }
  }

  private async checkIfUserExists(em: EntityManager, email: string) {
    const existingUser = await em.findOne(User, {
      email,
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
  }
}
