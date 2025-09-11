import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PokemonTypeModule } from './pokemon-types/pokemon-types.module';
import mikroOrmConfig from '../mikro-orm.config';
import { PokemonModule } from './pokemons/pokemons.module';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    PokemonTypeModule,
    PokemonModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
