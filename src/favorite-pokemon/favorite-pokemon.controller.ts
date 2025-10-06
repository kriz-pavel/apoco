import { Controller, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritePokemonService } from './favorite-pokemon.service';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import type { AuthenticatedUser } from '../auth/guards/auth-token.guard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { PokedexIdDto } from '../pokemon/dto/pokedex-id.dto';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@UseGuards(AuthTokenGuard)
@ApiBearerAuth('access-token')
@Controller('me/favorite-pokemon')
export class FavoritePokemonController {
  constructor(
    private readonly favoritePokemonService: FavoritePokemonService,
  ) {}

  @Post(':pokedexId')
  @HttpCode(204)
  @ApiOperation({
    summary: "Add a Pokemon to the user's favorites",
  })
  @ApiNoContentResponse({
    description: "The Pokemon was added to the user's favorites",
  })
  @ApiBadRequestResponse({
    description: 'Invalid Pokedex ID',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Pokemon not found',
    type: ErrorResponseDto,
  })
  addToFavorites(
    @AuthUser() user: AuthenticatedUser,
    @Param() params: PokedexIdDto,
  ): Promise<void> {
    return this.favoritePokemonService.addToFavorites({
      userId: user.id,
      pokedexId: params.pokedexId,
    });
  }

  @Delete(':pokedexId')
  @HttpCode(204)
  @ApiOperation({
    summary: "Remove a Pokemon from the user's favorites",
  })
  @ApiNoContentResponse({
    description: "The Pokemon was removed from the user's favorites",
  })
  @ApiBadRequestResponse({
    description: 'Invalid Pokedex ID',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Pokemon not found',
    type: ErrorResponseDto,
  })
  removeFavoritePokemon(
    @AuthUser() user: AuthenticatedUser,
    @Param() params: PokedexIdDto,
  ): Promise<void> {
    return this.favoritePokemonService.removeFavoritePokemon({
      userId: user.id,
      pokedexId: params.pokedexId,
    });
  }
}
