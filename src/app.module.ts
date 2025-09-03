import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PokemonTypeModule } from './pokemon-type/pokemon-type.module';
import mikroOrmConfig from '../mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig), PokemonTypeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
