// src/pokemon/pokemon.module.ts
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonService } from './pokemons.service';
import { PokemonController } from './pokemons.controller';
import { Candy } from './entities/candy.entity';
import { Classification } from './entities/classification.entity';
import { Attack } from './entities/attack.entity';
import { PokemonFilterBuilder } from './pokemon-filter-builder/pokemon-filter.builder';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Pokemon, Candy, Classification, Attack]),
    AuthModule,
  ],
  providers: [PokemonService, PokemonFilterBuilder],
  controllers: [PokemonController],
  exports: [PokemonService, PokemonFilterBuilder],
})
export class PokemonModule {}
