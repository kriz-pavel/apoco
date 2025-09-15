import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PokemonService } from './pokemons.service';
import { FilterPokemonQueryDto } from '../pokemons/pokemon-filter-builder/dto/filter-pokemon-query.dto';
import { GetPokemonByIdDto } from './dto/get-pokemon-by-id.dto';
import { GetPokemonByNameDto } from './dto/get-pokemon-by-name.dto';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import type { AuthenticatedUser } from '../auth/guards/auth-token.guard';
import { AuthUser } from '../auth/decorators/auth-user.decorator';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseGuards(AuthTokenGuard)
  @Get()
  getAllPokemons(
    @AuthUser() user: AuthenticatedUser,
    @Query() query: FilterPokemonQueryDto,
  ) {
    return this.pokemonService.getAllFilteredPokemon({ user, query });
  }

  @Get(':pokedexId')
  getPokemonByPokedexId(@Param() params: GetPokemonByIdDto) {
    return this.pokemonService.getPokemonByPokedexId({
      pokedexId: params.pokedexId,
    });
  }

  @Get('/by-name/:name')
  getPokemonByName(@Param() params: GetPokemonByNameDto) {
    return this.pokemonService.getPokemonByName({
      name: params.name,
    });
  }
}
