import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Pokemon } from '../pokemons/entities/pokemon.entity';
import { FavoritePokemon } from './entities/favorite-pokemon.entity';
import { PreconditionsService } from '../common/preconditions/preconditions.service';
import { ConversionServiceService } from '../common/conversion/conversion.service';
import { PokemonListResponseDto } from '../common/dto/pokemon-list-response.dto';
@Injectable()
export class FavoritePokemonsService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: EntityRepository<Pokemon>,
    @InjectRepository(FavoritePokemon)
    private readonly favoritePokemonRepository: EntityRepository<FavoritePokemon>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @Inject(ConversionServiceService)
    private readonly conversionService: ConversionServiceService,
    @Inject(PreconditionsService)
    private readonly preconditionsService: PreconditionsService,
  ) {}

  addToFavorites({
    userId,
    pokedexId,
  }: {
    userId: number;
    pokedexId: number;
  }): Promise<void> {
    const em = this.favoritePokemonRepository.getEntityManager();
    return em.transactional(async (em) => {
      const user = await this.findUserById({ id: userId, em });
      const pokemon = await this.findPokemonById({ pokedexId, em });
      const favoritePokemon = em.create(FavoritePokemon, {
        user,
        pokemon,
      });
      await em.persistAndFlush(favoritePokemon);
    });
  }

  async getAllFavoritePokemons({ userId }: { userId: number }): Promise<any[]> {
    const user = await this.findUserById({ id: userId });
    const favoritePokemons = await this.favoritePokemonRepository.findAll({
      where: { user },
      populate: [
        'pokemon',
        'pokemon.classification',
        'pokemon.attacks',
        'pokemon.attacks.type',
        'pokemon.types',
        'pokemon.resistant',
        'pokemon.weaknesses',
        'pokemon.evolutions',
        'pokemon.evolutions.candy',
        'pokemon.evolutions.toPokemon',
        'pokemon.previousEvolutions',
        'pokemon.previousEvolutions.fromPokemon',
      ],
    });

    return this.mapFavoritePokemon(favoritePokemons);
  }

  removeFavoritePokemon({
    userId,
    pokedexId,
  }: {
    userId: number;
    pokedexId: number;
  }): Promise<number> {
    const em = this.favoritePokemonRepository.getEntityManager();
    return em.transactional(async (em) => {
      const user = await this.findUserById({ id: userId, em });
      const pokemon = await this.findPokemonById({ pokedexId, em });
      return this.favoritePokemonRepository.nativeDelete({
        user,
        pokemon,
      });
    });
  }

  private mapFavoritePokemon(
    favoritePokemons: FavoritePokemon[],
  ): PokemonListResponseDto[] {
    return favoritePokemons.map((favoritePokemonData) => {
      const pokemon = favoritePokemonData.pokemon;
      const id = this.conversionService.convertIdToPokedexIdString(
        pokemon.pokedexId,
      );
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
      const weightMax = this.conversionService.convertGramsToKilogramsString(
        pokemon.weightMax,
      );
      const weightMin = this.conversionService.convertGramsToKilogramsString(
        pokemon.weightMin,
      );
      const heightMax = this.conversionService.convertCmToMetrsString(
        pokemon.heightMax,
      );
      const heightMin = this.conversionService.convertCmToMetrsString(
        pokemon.heightMin,
      );
      const evolutionRequirements = {
        candy: pokemon.evolutions[0]?.candy.name,
        candyAmount: pokemon.evolutions[0]?.candyAmount,
      };
      const evolutions = pokemon.evolutions.map((evolution) => ({
        id: this.conversionService.convertIdToPokedexIdString(
          evolution.toPokemon.pokedexId,
        ),
        name: evolution.toPokemon.name,
      }));
      const previousEvolutions = pokemon.previousEvolutions.map(
        (previousEvolution) => ({
          id: this.conversionService.convertIdToPokedexIdString(
            previousEvolution.fromPokemon.pokedexId,
          ),
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
    });
  }

  private async findUserById({
    id,
    em,
  }: {
    id: number;
    em?: EntityManager;
  }): Promise<User> {
    return this.preconditionsService.checkExists(
      await (em
        ? em.findOne(User, { id })
        : this.userRepository.findOne({ id })),
      'User not found',
    );
  }

  private async findPokemonById({
    pokedexId,
    em,
  }: {
    pokedexId: number;
    em?: EntityManager;
  }): Promise<Pokemon> {
    return this.preconditionsService.checkExists(
      await (em
        ? em.findOne(Pokemon, { pokedexId })
        : this.pokemonRepository.findOne({ pokedexId })),
      'Pokemon not found',
    );
  }
}
