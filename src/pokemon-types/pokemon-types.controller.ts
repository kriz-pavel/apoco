import { Controller, Get } from '@nestjs/common';
import { PokemonTypeService } from './pokemon-types.service';

@Controller('types')
export class PokemonTypeController {
  constructor(private readonly pokemonTypeService: PokemonTypeService) {}

  @Get()
  findAll() {
    return this.pokemonTypeService.findAll();
  }
}
