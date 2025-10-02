import { Module, Logger } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PokemonTypeModule } from './pokemon-types/pokemon-types.module';
import mikroOrmConfig from '../mikro-orm.config';
import { PokemonModule } from './pokemons/pokemons.module';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FavoritePokemonsModule } from './favorite-pokemons/favorite-pokemons.module';
import { HealthModule } from './health/health.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    PokemonTypeModule,
    PokemonModule,
    UserModule,
    AuthModule,
    FavoritePokemonsModule,
    HealthModule,
    TerminusModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
