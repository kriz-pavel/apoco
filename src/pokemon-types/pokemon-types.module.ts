import { Module } from '@nestjs/common';
import { PokemonTypeService } from './pokemon-types.service';
import { PokemonTypeController } from './pokemon-types.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PokemonType } from './entities/pokemon-type.entity';

@Module({
  imports: [MikroOrmModule.forFeature([PokemonType])],
  controllers: [PokemonTypeController],
  providers: [PokemonTypeService],
})
export class PokemonTypeModule {}
