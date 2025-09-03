import { Module } from '@nestjs/common';
import { PokemonTypeService } from './pokemon-type.service';
import { PokemonTypeController } from './pokemon-type.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PokemonType } from './pokemon-type.entity';

@Module({
  imports: [MikroOrmModule.forFeature([PokemonType])],
  controllers: [PokemonTypeController],
  providers: [PokemonTypeService],
})
export class PokemonTypeModule {}
