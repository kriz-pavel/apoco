import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  controllers: [HealthController],
  providers: [],
  imports: [TerminusModule, MikroOrmModule],
})
export class HealthModule {}
