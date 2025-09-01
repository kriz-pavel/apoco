import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SeedService } from './seed.service';
import { Pokemon } from '../pokemon/pokemon.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Pokemon])],
  providers: [SeedService],
})
export class SeedModule {}
