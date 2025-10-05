import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../users/entities/user.entity';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { FavoritePokemon } from './entities/favorite-pokemon.entity';
import { checkFound } from '../common/preconditions/preconditions';
import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

@Injectable()
export class FavoritePokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: EntityRepository<Pokemon>,
    @InjectRepository(FavoritePokemon)
    private readonly favoritePokemonRepository: EntityRepository<FavoritePokemon>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  addToFavorites({
    userId,
    pokedexId,
  }: {
    userId: number;
    pokedexId: number;
  }): Promise<void> {
    try {
      const em = this.favoritePokemonRepository.getEntityManager();
      return em.transactional(async (em) => {
        const user = await this.findUserById({ id: userId, em });
        const pokemon = await this.findPokemonByPokedexId({ pokedexId, em });
        const favoritePokemon = em.create(FavoritePokemon, {
          user,
          pokemon,
        });
        await em.persistAndFlush(favoritePokemon);
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw ServiceUnavailableException;
    }
  }

  removeFavoritePokemon({
    userId,
    pokedexId,
  }: {
    userId: number;
    pokedexId: number;
  }): Promise<void> {
    try {
      const em = this.favoritePokemonRepository.getEntityManager();
      return em.transactional(async (em) => {
        const user = await this.findUserById({ id: userId, em });
        const pokemon = await this.findPokemonByPokedexId({ pokedexId, em });
        return void this.favoritePokemonRepository.nativeDelete({
          user,
          pokemon,
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw ServiceUnavailableException;
    }
  }

  private async findUserById({
    id,
    em,
  }: {
    id: number;
    em?: EntityManager;
  }): Promise<User> {
    const user = await (em
      ? em.findOne(User, { id })
      : this.userRepository.findOne({ id }));

    return checkFound(user, 'User not found');
  }

  private async findPokemonByPokedexId({
    pokedexId,
    em,
  }: {
    pokedexId: number;
    em?: EntityManager;
  }): Promise<Pokemon> {
    const pokemon = await (em
      ? em.findOne(Pokemon, { pokedexId })
      : this.pokemonRepository.findOne({ pokedexId }));

    return checkFound(pokemon, 'Pokemon not found');
  }
}
