import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Pokemon } from '../pokemons/entities/pokemon.entity';
import { FavoritePokemon } from './entities/favorite-pokemon.entity';
import { checkExists } from '../common/preconditions/preconditions';
@Injectable()
export class FavoritePokemonsService {
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
      const pokemon = await this.findPokemonByPokedexId({ pokedexId, em });
      return this.favoritePokemonRepository.nativeDelete({
        user,
        pokemon,
      });
    });
  }

  private async findUserById({
    id,
    em,
  }: {
    id: number;
    em?: EntityManager;
  }): Promise<User> {
    return checkExists(
      await (em
        ? em.findOne(User, { id })
        : this.userRepository.findOne({ id })),
      'User not found',
    );
  }

  private async findPokemonByPokedexId({
    pokedexId,
    em,
  }: {
    pokedexId: number;
    em?: EntityManager;
  }): Promise<Pokemon> {
    return checkExists(
      await (em
        ? em.findOne(Pokemon, { pokedexId })
        : this.pokemonRepository.findOne({ pokedexId })),
      'Pokemon not found',
    );
  }
}
