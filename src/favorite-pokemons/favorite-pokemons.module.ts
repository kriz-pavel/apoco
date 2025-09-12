import { Module } from '@nestjs/common';
import { FavoritePokemonsService } from './favorite-pokemons.service';
import { FavoritePokemonsController } from './favorite-pokemons.controller';
import { AuthModule } from '../auth/auth.module';
import { PokemonModule } from '../pokemons/pokemons.module';
import { FavoritePokemon } from './entities/favorite-pokemon.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Pokemon } from '../pokemons/entities/pokemon.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([FavoritePokemon, Pokemon, User]),
    AuthModule,
    PokemonModule,
  ],
  controllers: [FavoritePokemonsController],
  providers: [FavoritePokemonsService],
})
export class FavoritePokemonsModule {}
