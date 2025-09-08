import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PokemonTypeModule } from './pokemon-type/pokemon-type.module';
import mikroOrmConfig from '../mikro-orm.config';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    PokemonTypeModule,
    PokemonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
