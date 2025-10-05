import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PokemonTypeModule } from './pokemon-types/pokemon-types.module';
import mikroOrmConfig from '../mikro-orm.config';
import { PokemonModule } from './pokemon/pokemon.module';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FavoritePokemonModule } from './favorite-pokemon/favorite-pokemon.module';
import { HealthModule } from './health/health.module';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigurationService, validate } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate as (
        config: Record<string, unknown>,
      ) => Record<string, unknown>,
      envFilePath: '.env',
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    PokemonTypeModule,
    PokemonModule,
    UserModule,
    AuthModule,
    FavoritePokemonModule,
    HealthModule,
    TerminusModule,
  ],
  controllers: [],
  providers: [Logger, ConfigurationService],
})
export class AppModule {}
