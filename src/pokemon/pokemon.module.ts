// src/pokemon/pokemon.module.ts
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Candy } from './entities/candy.entity';
import { Classification } from './entities/classification.entity';
import { Attack } from './entities/attack.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Pokemon, Candy, Classification, Attack]),
  ],
  providers: [PokemonService],
  controllers: [PokemonController],
  exports: [PokemonService],
})
export class PokemonModule {}
