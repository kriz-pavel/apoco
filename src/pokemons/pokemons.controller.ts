import {
  Controller,
  Get,
  Header,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PokemonService } from './pokemons.service';
import { FilterPokemonQueryDto } from './dto/filter-pokemon-query.dto';
import { PokedexIdDto } from './dto/pokedex-id.dto';
import { GetPokemonByNameDto } from './dto/get-pokemon-by-name.dto';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import type { AuthenticatedUser } from '../auth/guards/auth-token.guard';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiServiceUnavailableResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PokemonDetailResponseDto } from './dto/pokemon-detail-response.dto';
import { PokemonListResponseDto } from './dto/pokemon-list-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('access-token')
  @Get()
  @ApiOperation({
    summary: 'Get all Pokemons with filtering, searching and pagination',
  })
  @ApiOkResponse({
    description: 'All Pokemons with filtering, searching and pagination',
    type: PokemonListResponseDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized if "favorites=true" is present in the query and the user is not authenticated',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  @ApiServiceUnavailableResponse({
    description: 'Service unavailable',
    type: ErrorResponseDto,
  })
  getAllPokemons(
    @AuthUser() user: AuthenticatedUser,
    @Query() query: FilterPokemonQueryDto,
  ) {
    return this.pokemonService.getAllFilteredPokemon({ user, query });
  }

  @Get(':pokedexId')
  @Header(
    'Cache-Control',
    'public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400, stale-if-error=604800',
  )
  @Header('Vary', 'Accept-Encoding')
  @ApiOperation({
    summary: 'Get a Pokemon by its Pokedex ID',
  })
  @ApiOkResponse({
    description: 'The Pokemon with the given Pokedex ID',
    type: PokemonDetailResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Pokemon not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid Pokedex ID',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  @ApiParam({
    name: 'pokedexId',
    description: 'The Pokedex ID of the Pokemon',
    type: String,
  })
  getPokemonByPokedexId(@Param() params: PokedexIdDto) {
    return this.pokemonService.getPokemonByPokedexId({
      pokedexId: params.pokedexId,
    });
  }

  @Get('/by-name/:name')
  @Header(
    'Cache-Control',
    'public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400, stale-if-error=604800',
  )
  @Header('Vary', 'Accept-Encoding')
  @ApiOperation({
    summary: 'Get a Pokemon by its name',
  })
  @ApiOkResponse({
    description: 'The Pokemon with the given name',
    type: PokemonDetailResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Pokemon not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid name',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the Pokemon',
    type: String,
  })
  getPokemonByName(@Param() params: GetPokemonByNameDto) {
    return this.pokemonService.getPokemonByName({
      name: params.name,
    });
  }
}
