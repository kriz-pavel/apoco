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
import { ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonSortDir, PokemonSortBy } from './dto/filter-pokemon-query.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseGuards(AuthTokenGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all Pokemons with filtering, searching and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'All Pokemons with filtering, searching and pagination',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized if "favorites=true" is present in the query and the user is not authenticated',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'sortBy', enum: PokemonSortBy, required: false })
  @ApiQuery({ name: 'sortDir', enum: PokemonSortDir, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  @ApiQuery({ name: 'type', type: String, required: false })
  @ApiQuery({ name: 'favorites', type: Boolean, required: false })
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
  @ApiResponse({
    status: 200,
    description: 'The Pokemon with the given Pokedex ID',
    type: Pokemon,
  })
  @ApiResponse({
    status: 404,
    description: 'Pokemon not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
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
  @ApiResponse({
    status: 200,
    description: 'The Pokemon with the given name',
    type: Pokemon,
  })
  @ApiResponse({
    status: 404,
    description: 'Pokemon not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
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
