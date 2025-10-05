import { Controller, Get, Header } from '@nestjs/common';
import { PokemonTypeService } from './pokemon-types.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import { PokemonTypeResponseDto } from './dto/pokemon-type-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@Controller('types')
export class PokemonTypeController {
  constructor(private readonly pokemonTypeService: PokemonTypeService) {}

  @Get()
  @Header(
    'Cache-Control',
    'public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400, stale-if-error=604800',
  )
  @Header('Vary', 'Accept-Encoding')
  @ApiOperation({
    summary: 'Get all Pokemon types',
  })
  @ApiOkResponse({
    description: 'All Pokemon types',
    type: [PokemonTypeResponseDto],
  })
  @ApiServiceUnavailableResponse({
    description: 'Service unavailable',
    type: ErrorResponseDto,
  })
  findAll() {
    return this.pokemonTypeService.findAll();
  }
}
