import { Module } from '@nestjs/common';
import { FavoritePokemonService } from './favorite-pokemon.service';
import { FavoritePokemonController } from './favorite-pokemon.controller';
import { AuthModule } from '../auth/auth.module';
import { PokemonModule } from '../pokemon/pokemon.module';
import { FavoritePokemon } from './entities/favorite-pokemon.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([FavoritePokemon, Pokemon, User]),
    AuthModule,
    PokemonModule,
  ],
  controllers: [FavoritePokemonController],
  providers: [FavoritePokemonService],
})
export class FavoritePokemonModule {}
