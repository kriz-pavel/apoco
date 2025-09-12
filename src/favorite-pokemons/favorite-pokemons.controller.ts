import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { FavoritePokemonsService } from './favorite-pokemons.service';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import type { AuthenticatedUser } from '../auth/guards/auth-token.guard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { Pokemon } from '../pokemons/entities/pokemon.entity';

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
    @Param('pokedexId', ParseIntPipe) pokedexId: number,
  ): Promise<void> {
    await this.favoritePokemonsService.addToFavorites({
      userId: user.id,
      pokedexId,
    });
  }

  @Get()
  getAllFavoritePokemons(
    @AuthUser() user: AuthenticatedUser,
  ): Promise<Pokemon[]> {
    return this.favoritePokemonsService.getAllFavoritePokemons({
      userId: user.id,
    });
  }

  @Delete(':pokedexId')
  @HttpCode(204)
  async removeFavoritePokemon(
    @AuthUser() user: AuthenticatedUser,
    @Param('pokedexId', ParseIntPipe) pokedexId: number,
  ): Promise<void> {
    await this.favoritePokemonsService.removeFavoritePokemon({
      userId: user.id,
      pokedexId,
    });
  }
}
