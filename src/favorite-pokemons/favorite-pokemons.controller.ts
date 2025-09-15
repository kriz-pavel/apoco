import { Controller, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritePokemonsService } from './favorite-pokemons.service';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import type { AuthenticatedUser } from '../auth/guards/auth-token.guard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { GetPokemonByIdDto } from 'src/pokemons/dto/get-pokemon-by-id.dto';

@UseGuards(AuthTokenGuard)
@Controller('me/favorite-pokemon')
export class FavoritePokemonsController {
  constructor(
    private readonly favoritePokemonsService: FavoritePokemonsService,
  ) {}

  @Post(':pokedexId')
  @HttpCode(204)
  async addToFavorites(
    @AuthUser() user: AuthenticatedUser,
    @Param() params: GetPokemonByIdDto,
  ): Promise<void> {
    await this.favoritePokemonsService.addToFavorites({
      userId: user.id,
      pokedexId: params.pokedexId,
    });
  }

  @Delete(':pokedexId')
  @HttpCode(204)
  async removeFavoritePokemon(
    @AuthUser() user: AuthenticatedUser,
    @Param() params: GetPokemonByIdDto,
  ): Promise<void> {
    await this.favoritePokemonsService.removeFavoritePokemon({
      userId: user.id,
      pokedexId: params.pokedexId,
    });
  }
}
