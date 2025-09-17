import { Controller, Get } from '@nestjs/common';
import { PokemonTypeService } from './pokemon-types.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('types')
export class PokemonTypeController {
  constructor(private readonly pokemonTypeService: PokemonTypeService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all Pokemon types',
  })
  @ApiOkResponse({
    description: 'All Pokemon types',
  })
  findAll() {
    return this.pokemonTypeService.findAll();
  }
}
