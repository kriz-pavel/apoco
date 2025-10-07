import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RotateTokenDto } from './dto/rotate-token.dto';
import * as crypto from 'crypto';
import {
  EntityManager,
  EntityRepository,
  LockMode,
} from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Token } from './entities/token.entity';

export const TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: EntityRepository<Token>,
  ) {}

  async rotateToken(rotateTokenDto: RotateTokenDto) {
    return this.tokenRepository
      .getEntityManager()
      .transactional(async (tem) => {
        const token = await tem.findOne(
          Token,
          { tokenHash: this.hashToken(rotateTokenDto.token) },
          { lockMode: LockMode.PESSIMISTIC_WRITE },
        );
        if (!token) {
          throw new UnauthorizedException();
        }
        if (token.isRevoked) {
          throw new UnauthorizedException();
        }
        if (token.expiresAt <= new Date()) {
          throw new UnauthorizedException();
        }

        await this.revokeToken(token, tem);
        const newToken = await this.createToken(token, tem);

        return {
          token: newToken,
        };
      });
  }

  async getTokenRecord(token: string) {
    const validToken = await this.tokenRepository.findOne(
      {
        tokenHash: this.hashToken(token),
        isRevoked: false,
      },
      { populate: ['user'] },
    );
    if (!validToken || validToken.expiresAt <= new Date()) {
      return null;
    }

    return validToken;
  }

  generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  getTokenExpirationTime() {
    return new Date(Date.now() + TOKEN_EXPIRATION_TIME);
  }

  private async revokeToken(token: Token, tem: EntityManager) {
    token.isRevoked = true;
    await tem.persistAndFlush(token);
  }

  private async createToken(token: Token, tem: EntityManager) {
    const newToken = this.generateToken();
    const newTokenHash = this.hashToken(newToken);
    const newTokenEntity = tem.create(Token, {
      tokenHash: newTokenHash,
      expiresAt: this.getTokenExpirationTime(),
      user: token.user,
    });
    await tem.persistAndFlush(newTokenEntity);

    return newToken;
  }
}
