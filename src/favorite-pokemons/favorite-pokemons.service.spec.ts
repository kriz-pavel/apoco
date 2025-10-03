import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { FavoritePokemonsService } from './favorite-pokemons.service';
import { FavoritePokemon } from './entities/favorite-pokemon.entity';
import { Pokemon } from '../pokemons/entities/pokemon.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

/* eslint-disable @typescript-eslint/unbound-method */

describe('FavoritePokemonsService', () => {
  let service: FavoritePokemonsService;
  let pokemonRepository: jest.Mocked<EntityRepository<Pokemon>>;
  let favoritePokemonRepository: jest.Mocked<EntityRepository<FavoritePokemon>>;
  let entityManager: jest.Mocked<EntityManager>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
  } as unknown as User;

  const mockPokemon = {
    id: 1,
    pokedexId: 1,
    name: 'Bulbasaur',
    slug: 'bulbasaur',
  } as unknown as Pokemon;

  const mockFavoritePokemon = {
    id: 1,
    user: mockUser,
    pokemon: mockPokemon,
  } as unknown as FavoritePokemon;

  beforeEach(async () => {
    const mockPokemonRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      getEntityManager: jest.fn(),
    } as unknown as jest.Mocked<EntityRepository<Pokemon>>;

    const mockFavoritePokemonRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
      nativeDelete: jest.fn(),
      getEntityManager: jest.fn(),
    } as unknown as jest.Mocked<EntityRepository<FavoritePokemon>>;

    const mockUserRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<EntityRepository<User>>;

    const mockEntityManager = {
      transactional: jest.fn(),
      create: jest.fn(),
      persist: jest.fn(),
      persistAndFlush: jest.fn(),
      flush: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritePokemonsService,
        {
          provide: getRepositoryToken(Pokemon),
          useValue: mockPokemonRepository,
        },
        {
          provide: getRepositoryToken(FavoritePokemon),
          useValue: mockFavoritePokemonRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<FavoritePokemonsService>(FavoritePokemonsService);
    pokemonRepository = module.get<EntityRepository<Pokemon>>(
      getRepositoryToken(Pokemon),
    ) as jest.Mocked<EntityRepository<Pokemon>>;
    favoritePokemonRepository = module.get<EntityRepository<FavoritePokemon>>(
      getRepositoryToken(FavoritePokemon),
    ) as jest.Mocked<EntityRepository<FavoritePokemon>>;

    // Setup entity manager mock
    entityManager = mockEntityManager;
    pokemonRepository.getEntityManager.mockReturnValue(entityManager);
    favoritePokemonRepository.getEntityManager.mockReturnValue(entityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToFavorites', () => {
    it('should successfully add Pokemon to favorites', async () => {
      // Arrange
      const userId = 1;
      const pokedexId = 1;

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne
        .mockResolvedValueOnce(mockUser) // findUserById
        .mockResolvedValueOnce(mockPokemon) // findPokemonByPokedexId
        .mockResolvedValueOnce(null); // check if favorite already exists

      entityManager.create.mockReturnValue(mockFavoritePokemon);

      // Act
      await service.addToFavorites({ userId, pokedexId });

      // Assert
      expect(entityManager.transactional).toHaveBeenCalledTimes(1);
      expect(entityManager.findOne).toHaveBeenCalledTimes(2);
      expect(entityManager.findOne).toHaveBeenNthCalledWith(1, User, {
        id: userId,
      });
      expect(entityManager.findOne).toHaveBeenNthCalledWith(2, Pokemon, {
        pokedexId,
      });
      expect(entityManager.create).toHaveBeenCalledWith(FavoritePokemon, {
        user: mockUser,
        pokemon: mockPokemon,
      });
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith(
        mockFavoritePokemon,
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const userId = 999;
      const pokedexId = 1;

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne.mockResolvedValueOnce(null); // user not found

      // Act & Assert
      await expect(
        service.addToFavorites({ userId, pokedexId }),
      ).rejects.toThrow(NotFoundException);

      expect(entityManager.findOne).toHaveBeenCalledWith(User, { id: userId });
      expect(entityManager.persistAndFlush).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when Pokemon not found', async () => {
      // Arrange
      const userId = 1;
      const pokedexId = 999;

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne
        .mockResolvedValueOnce(mockUser) // findUserById
        .mockResolvedValueOnce(null); // Pokemon not found

      // Act & Assert
      await expect(
        service.addToFavorites({ userId, pokedexId }),
      ).rejects.toThrow(NotFoundException);

      expect(entityManager.findOne).toHaveBeenNthCalledWith(2, Pokemon, {
        pokedexId,
      });
      expect(entityManager.persistAndFlush).not.toHaveBeenCalled();
    });

    it('should successfully add Pokemon even if already favorited (no duplicate check, idempotent)', async () => {
      // Arrange - The service doesn't check for duplicates, so it will attempt to add
      const userId = 1;
      const pokedexId = 1;

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne
        .mockResolvedValueOnce(mockUser) // findUserById
        .mockResolvedValueOnce(mockPokemon); // findPokemonByPokedexId

      entityManager.create.mockReturnValue(mockFavoritePokemon);

      // Act
      await service.addToFavorites({ userId, pokedexId });

      // Assert
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith(
        mockFavoritePokemon,
      );
    });

    it('should handle transactional errors', async () => {
      // Arrange
      const userId = 1;
      const pokedexId = 1;
      const dbError = new Error('Database transaction failed');

      entityManager.transactional.mockRejectedValue(dbError);

      // Act & Assert
      await expect(
        service.addToFavorites({ userId, pokedexId }),
      ).rejects.toThrow('Database transaction failed');
    });
  });

  describe('removeFavoritePokemon', () => {
    it('should successfully remove Pokemon from favorites', async () => {
      // Arrange
      const userId = 1;
      const pokedexId = 1;

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne
        .mockResolvedValueOnce(mockUser) // findUserById
        .mockResolvedValueOnce(mockPokemon) // findPokemonByPokedexId
        .mockResolvedValueOnce(mockFavoritePokemon); // find existing favorite

      // Act
      await service.removeFavoritePokemon({ userId, pokedexId });

      // Assert
      expect(entityManager.transactional).toHaveBeenCalledTimes(1);
      expect(entityManager.findOne).toHaveBeenCalledTimes(2);
      expect(favoritePokemonRepository.nativeDelete).toHaveBeenCalledWith({
        user: mockUser,
        pokemon: mockPokemon,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const userId = 999;
      const pokedexId = 1;

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne.mockResolvedValueOnce(null); // user not found

      // Act & Assert
      await expect(
        service.removeFavoritePokemon({ userId, pokedexId }),
      ).rejects.toThrow('User not found');

      expect(favoritePokemonRepository.nativeDelete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when Pokemon not found', async () => {
      // Arrange
      const userId = 1;
      const pokedexId = 999;

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne
        .mockResolvedValueOnce(mockUser) // findUserById
        .mockResolvedValueOnce(null); // Pokemon not found

      // Act & Assert
      await expect(
        service.removeFavoritePokemon({ userId, pokedexId }),
      ).rejects.toThrow('Pokemon not found');

      expect(favoritePokemonRepository.nativeDelete).not.toHaveBeenCalled();
    });

    it('should call nativeDelete even if favorite does not exist (idempotent)', async () => {
      // Arrange - The service doesn't check for existence, it just calls nativeDelete
      const userId = 1;
      const pokedexId = 1;

      entityManager.transactional.mockImplementation(async (callback) => {
        return await callback(entityManager);
      });

      entityManager.findOne
        .mockResolvedValueOnce(mockUser) // findUserById
        .mockResolvedValueOnce(mockPokemon); // findPokemonByPokedexId

      favoritePokemonRepository.nativeDelete.mockResolvedValue(0);

      // Act
      await service.removeFavoritePokemon({ userId, pokedexId });

      // Assert
      expect(favoritePokemonRepository.nativeDelete).toHaveBeenCalledWith({
        user: mockUser,
        pokemon: mockPokemon,
      });
    });

    it('should handle transactional errors during removal', async () => {
      // Arrange
      const userId = 1;
      const pokedexId = 1;
      const dbError = new Error('Database transaction failed');

      entityManager.transactional.mockRejectedValue(dbError);

      // Act & Assert
      await expect(
        service.removeFavoritePokemon({ userId, pokedexId }),
      ).rejects.toThrow('Database transaction failed');
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Arrange
      const userId = 1;
      const pokedexId = 1;

      // Mock getEntityManager to return a normal EM, but make transactional fail
      favoritePokemonRepository.getEntityManager.mockReturnValue(entityManager);
      entityManager.transactional.mockRejectedValue(
        new Error('Database connection lost'),
      );

      // Act & Assert
      await expect(
        service.addToFavorites({ userId, pokedexId }),
      ).rejects.toThrow('Database connection lost');
    });

    it('should handle concurrent modification conflicts', async () => {
      // Arrange
      const userId = 1;
      const pokedexId = 1;

      entityManager.transactional.mockImplementation(() => {
        // Simulate concurrent modification
        return Promise.reject(new Error('Serialization failure'));
      });

      // Act & Assert
      await expect(
        service.addToFavorites({ userId, pokedexId }),
      ).rejects.toThrow('Serialization failure');
    });
  });
});
