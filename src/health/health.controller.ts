import { Controller, Get } from '@nestjs/common';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { EntityManager } from '@mikro-orm/core';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly em: EntityManager,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.healthCheckService.check([this.checkDatabase]);
  }

  private checkDatabase = async (): Promise<HealthIndicatorResult> => {
    try {
      await this.em.getConnection().execute('SELECT 1');
      return { mikroorm: { status: 'up' } };
    } catch (err) {
      return {
        mikroorm: { status: 'down', message: (err as Error).message },
      };
    }
  };
}
