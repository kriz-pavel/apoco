import { Module } from '@nestjs/common';
import { SeedModule } from './seed/seed.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../mikro-orm.config';

@Module({
  imports: [SeedModule, MikroOrmModule.forRoot(mikroOrmConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
