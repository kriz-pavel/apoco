import { Controller, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritePokemonsService } from './favorite-pokemons.service';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import type { AuthenticatedUser } from '../auth/guards/auth-token.guard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { GetPokemonByIdDto } from 'src/pokemons/dto/get-pokemon-by-id.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthTokenGuard)
@Controller('me/favorite-pokemon')
export class FavoritePokemonsController {
  constructor(
    private readonly favoritePokemonsService: FavoritePokemonsService,
  ) {}

  @Post(':pokedexId')
  @HttpCode(204)
  @ApiOperation({
    summary: "Add a Pokemon to the user's favorites",
  })
  @ApiResponse({
    status: 204,
    description: "The Pokemon was added to the user's favorites",
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Pokedex ID',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Pokemon not found',
  })
  @ApiParam({
    name: 'pokedexId',
    description: 'The Pokedex ID of the Pokemon',
    type: GetPokemonByIdDto,
  })
  addToFavorites(
    @AuthUser() user: AuthenticatedUser,
    @Param() params: GetPokemonByIdDto,
  ): Promise<void> {
    return this.favoritePokemonsService.addToFavorites({
      userId: user.id,
      pokedexId: params.pokedexId,
    });
  }

  @Delete(':pokedexId')
  @HttpCode(204)
  @ApiOperation({
    summary: "Remove a Pokemon from the user's favorites",
  })
  @ApiResponse({
    status: 204,
    description: "The Pokemon was removed from the user's favorites",
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Pokedex ID',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Pokemon not found',
  })
  removeFavoritePokemon(
    @AuthUser() user: AuthenticatedUser,
    @Param() params: GetPokemonByIdDto,
  ): Promise<void> {
    return this.favoritePokemonsService.removeFavoritePokemon({
      userId: user.id,
      pokedexId: params.pokedexId,
    });
  }
}
