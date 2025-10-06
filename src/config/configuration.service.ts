import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Environment } from './env.validation';

@Injectable()
export class ConfigurationService {
  constructor(private configService: NestConfigService<Environment, true>) {}

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV', { infer: true });
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get port(): number {
    return this.configService.get('PORT', { infer: true });
  }

  get postgresDb(): string {
    return this.configService.get('POSTGRES_DB', { infer: true });
  }

  get postgresUser(): string {
    return this.configService.get('POSTGRES_USER', { infer: true });
  }

  get postgresPassword(): string {
    return this.configService.get('POSTGRES_PASSWORD', { infer: true });
  }

  get databaseUrl(): string {
    return this.configService.get('DATABASE_URL', { infer: true });
  }

  get apiPortHost(): number | undefined {
    return this.configService.get('API_PORT_HOST', { infer: true });
  }
}
