import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Pokemon } from './entities/pokemon.entity';
import { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import { FilterPokemonQueryDto } from './dto/filter-pokemon-query.dto';
import { PokemonDetailResponseDto } from './dto/pokemon-detail-response.dto';
import {
  convertIdToPokedexIdString,
  convertGramsToKilogramsString,
  convertCmToMetrsString,
} from '../common/conversions/conversions';
import { PokemonListResponseDto } from './dto/pokemon-list-response.dto';
import type { AuthenticatedUser } from '../auth/guards/auth-token.guard';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: EntityRepository<Pokemon>,
  ) {}

  async getAllFilteredPokemon({
    user,
    query,
  }: {
    user?: AuthenticatedUser;
    query: FilterPokemonQueryDto;
  }) {
    const { data, recordCount } = query.favorites
      ? await this.getFavoritePokemon({ user, query })
      : await this.getAllPokemons({ query });

    const pageCount = this.getPageCount({
      recordCount,
      limit: query.limit,
    });
    return {
      data: this.mapPokemonListResponse({ pokemon: data }),
      recordCount,
      currentPage: query.page,
      nextPage: this.getNextPage({
        page: query.page,
        pageCount,
      }),
      previousPage: this.getPreviousPage({
        page: query.page,
        pageCount,
      }),
      pageCount,
    };
  }

  async getPokemonByName({
    name,
  }: {
    name: string;
  }): Promise<PokemonDetailResponseDto> {
    const pokemon = await this.findPokemonDetail({
      filterQuery: { name: { $ilike: name } },
    });

    return this.mapPokemonDetailResponse({ pokemon });
  }

  async getPokemonByPokedexId({
    pokedexId,
  }: {
    pokedexId: number;
  }): Promise<PokemonDetailResponseDto> {
    const pokemon = await this.findPokemonDetail({
      filterQuery: { pokedexId },
    });

    return this.mapPokemonDetailResponse({ pokemon });
  }

  private async getAllPokemons({
    query,
  }: {
    query: FilterPokemonQueryDto;
  }): Promise<{ data: Pokemon[]; recordCount: number }> {
    const filterQuery = this.buildDbQueryOptions({
      filter: query,
    });

    try {
      const [pokemon, recordCount] = await this.pokemonRepository.findAndCount(
        filterQuery.where,
        {
          ...filterQuery.options,
          populate: [
            'types',
            'resistant',
            'weaknesses',
            'attacks',
            'evolutions',
            'previousEvolutions',
          ],
        },
      );

      return {
        data: pokemon,
        recordCount,
      };
    } catch {
      throw new ServiceUnavailableException();
    }
  }

  private async getFavoritePokemon({
    user,
    query,
  }: {
    user?: AuthenticatedUser;
    query: FilterPokemonQueryDto;
  }): Promise<{ data: Pokemon[]; recordCount: number }> {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const filterQuery = this.buildDbQueryOptions({
      filter: query,
    });

    try {
      const [favoritePokemon, recordCount] =
        await this.pokemonRepository.findAndCount(
          {
            ...filterQuery.where,
            favorites: {
              user: {
                id: user.id,
              },
            },
          },
          {
            ...filterQuery.options,
            populate: [
              'types',
              'classification',
              'resistant',
              'weaknesses',
              'attacks',
              'evolutions',
              'evolutions.candy',
              'evolutions.toPokemon',
              'previousEvolutions',
              'previousEvolutions.fromPokemon',
              'favorites',
              'favorites.user',
            ],
          },
        );

      return {
        data: favoritePokemon,
        recordCount,
      };
    } catch {
      throw new ServiceUnavailableException();
    }
  }

  private async findPokemonDetail({
    filterQuery,
  }: {
    filterQuery: FilterQuery<Pokemon>;
  }): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne(filterQuery, {
      populate: [
        'types.name',
        'classification',
        'resistant',
        'weaknesses',
        'attacks',
        'evolutions',
        'evolutions.candy',
        'evolutions.toPokemon',
        'previousEvolutions',
        'previousEvolutions.fromPokemon',
      ],
    });

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found');
    }

    return pokemon;
  }

  private mapPokemonListResponse({
    pokemon,
  }: {
    pokemon: Pokemon[];
  }): PokemonListResponseDto[] {
    return pokemon.map((pokemon) => {
      const id = convertIdToPokedexIdString(pokemon.pokedexId);
      const attacks = pokemon.attacks.map((attack) => ({
        name: attack.name,
        type: attack.type,
        damage: attack.damage,
        category: attack.category,
      }));
      const types = pokemon.types.map((type) => ({
        slug: type.slug,
        name: type.name,
      }));
      const resistant = pokemon.resistant.map((type) => ({
        slug: type.slug,
        name: type.name,
      }));
      const weaknesses = pokemon.weaknesses.map((type) => ({
        slug: type.slug,
        name: type.name,
      }));

      return {
        id,
        name: pokemon.name,
        classification: pokemon.classification.name,
        attacks,
        types,
        resistant,
        weaknesses,
        maxCP: pokemon.maxCP,
        maxHP: pokemon.maxHP,
        fleeRate: pokemon.fleeRate,
        isLegendary: pokemon.isLegendary,
        isMythical: pokemon.isMythical,
      };
    });
  }

  private mapPokemonDetailResponse({
    pokemon,
  }: {
    pokemon: Pokemon;
  }): PokemonDetailResponseDto {
    const id = convertIdToPokedexIdString(pokemon.pokedexId);
    const attacks = pokemon.attacks.map((attack) => ({
      name: attack.name,
      type: attack.type,
      damage: attack.damage,
      category: attack.category,
    }));
    const types = pokemon.types.map((type) => ({
      slug: type.slug,
      name: type.name,
    }));
    const resistant = pokemon.resistant.map((type) => ({
      slug: type.slug,
      name: type.name,
    }));
    const weaknesses = pokemon.weaknesses.map((type) => ({
      slug: type.slug,
      name: type.name,
    }));
    const weightMax = convertGramsToKilogramsString(pokemon.weightMax);
    const weightMin = convertGramsToKilogramsString(pokemon.weightMin);
    const heightMax = convertCmToMetrsString(pokemon.heightMax);
    const heightMin = convertCmToMetrsString(pokemon.heightMin);
    const evolutionRequirements = {
      candy: pokemon.evolutions[0]?.candy.name,
      candyAmount: pokemon.evolutions[0]?.candyAmount,
    };

    const evolutions = pokemon.evolutions.map((evolution) => ({
      id: convertIdToPokedexIdString(evolution.toPokemon.pokedexId),
      name: evolution.toPokemon.name,
    }));
    const previousEvolutions = pokemon.previousEvolutions.map(
      (previousEvolution) => ({
        id: convertIdToPokedexIdString(previousEvolution.fromPokemon.pokedexId),
        name: previousEvolution.fromPokemon.name,
      }),
    );

    return {
      id,
      name: pokemon.name,
      classification: pokemon.classification.name,
      attacks,
      types,
      resistant,
      weaknesses,
      weightMax,
      weightMin,
      heightMax,
      heightMin,
      maxCP: pokemon.maxCP,
      maxHP: pokemon.maxHP,
      fleeRate: pokemon.fleeRate,
      isLegendary: pokemon.isLegendary,
      isMythical: pokemon.isMythical,
      commonCaptureArea: pokemon.commonCaptureArea,
      evolutionRequirements,
      evolutions,
      previousEvolutions,
    };
  }

  private getNextPage({
    page,
    pageCount,
  }: {
    page: number;
    pageCount: number;
  }) {
    const nextPage = page + 1;
    return nextPage <= pageCount ? nextPage : null;
  }

  private getPreviousPage({
    page,
    pageCount,
  }: {
    page: number;
    pageCount: number;
  }) {
    const previousPage = page - 1;
    if (previousPage - 1 > pageCount || previousPage < 1) {
      return null;
    }
    return previousPage;
  }

  private getPageCount({
    recordCount,
    limit,
  }: {
    recordCount: number;
    limit: number;
  }) {
    return Math.ceil(recordCount / limit);
  }

  private buildDbQueryOptions({ filter }: { filter: FilterPokemonQueryDto }) {
    const { page, limit, sortBy, sortDir, types, q } = filter;
    return {
      where: {
        ...(q ? { name: { $ilike: `%${q}%` } } : {}),
        ...(types ? { types: { slug: { $in: types } } } : {}),
      },
      options: {
        offset: (page - 1) * limit,
        limit,
        orderBy: { [sortBy]: sortDir },
      },
    };
  }
}
