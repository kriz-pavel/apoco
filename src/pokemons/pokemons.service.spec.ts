import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { PokemonService } from './pokemons.service';
import { Pokemon } from './entities/pokemon.entity';
import {
  FilterPokemonQueryDto,
  PokemonSortBy,
  PokemonSortDir,
} from './dto/filter-pokemon-query.dto';
import type { AuthenticatedUser } from '../auth/guards/auth-token.guard';
import { PokemonListResponseDto } from './dto/pokemon-list-response.dto';
import { mockPokemon } from './mocks/pokemon.mock';
import {
  ServiceUnavailableException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import {
  convertGramsToKilogramsString,
  convertCmToMetrsString,
  convertIdToPokedexIdString,
} from '../common/conversions/conversions';

/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

describe('PokemonService', () => {
  let service: PokemonService;
  let repository: jest.Mocked<EntityRepository<Pokemon>>;

  const mockUser: AuthenticatedUser = {
    id: 1,
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const mockRepository = {
      findAndCount: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      persist: jest.fn(),
      flush: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<EntityRepository<Pokemon>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: getRepositoryToken(Pokemon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    repository = module.get<EntityRepository<Pokemon>>(
      getRepositoryToken(Pokemon),
    ) as jest.Mocked<EntityRepository<Pokemon>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFilteredPokemon', () => {
    const baseQuery: FilterPokemonQueryDto = {
      page: 1,
      limit: 20,
      sortBy: PokemonSortBy.pokedexId,
      sortDir: PokemonSortDir.asc,
    };

    it('should return paginated pokemon list successfully', async () => {
      // Arrange
      repository.findAndCount.mockResolvedValue([
        mockPokemon,
        mockPokemon.length,
      ]);

      // Act
      const result = await service.getAllFilteredPokemon({
        user: mockUser,
        query: baseQuery,
      });

      // Assert
      expect(result).toEqual({
        data: expect.any(Array) as PokemonListResponseDto[],
        recordCount: mockPokemon.length,
        currentPage: 1,
        nextPage: null,
        previousPage: null,
        pageCount: 1,
      });
      expect(result.data).toHaveLength(mockPokemon.length);
    });

    it('should handle search query filtering', async () => {
      // Arrange
      const queryWithSearch = { ...baseQuery, q: 'Bulbasaur' };
      const filteredPokemon = [mockPokemon[0]];
      repository.findAndCount.mockResolvedValue([filteredPokemon, 1]);

      // Act
      const result = await service.getAllFilteredPokemon({
        user: mockUser,
        query: queryWithSearch,
      });

      // Assert
      expect(result.recordCount).toBe(1);
      expect(result.data).toHaveLength(1);
    });

    it('should handle type filtering', async () => {
      // Arrange
      const queryWithTypes = { ...baseQuery, types: ['fire'] };
      const fireTypePokemon = [mockPokemon[1]];
      repository.findAndCount.mockResolvedValue([fireTypePokemon, 1]);

      // Act
      const result = await service.getAllFilteredPokemon({
        user: mockUser,
        query: queryWithTypes,
      });

      // Assert
      expect(result.recordCount).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toEqual(fireTypePokemon[0].name);
    });

    it('should handle multiple type filtering', async () => {
      // Arrange
      const pokemonTypes = ['fire', 'grass'];
      const queryWithTypes = { ...baseQuery, types: pokemonTypes };
      const filteredPokemon = mockPokemon.filter((p) =>
        p.types.find((type) => pokemonTypes.includes(type.slug)),
      );
      repository.findAndCount.mockResolvedValue([
        filteredPokemon,
        filteredPokemon.length,
      ]);

      // Act
      const result = await service.getAllFilteredPokemon({
        user: mockUser,
        query: queryWithTypes,
      });

      // Assert
      expect(result.recordCount).toBe(filteredPokemon.length);
      expect(result.data).toHaveLength(filteredPokemon.length);
      // check if the types are correct
      expect(
        result.data.every((p) =>
          p.types.some((type) => pokemonTypes.includes(type.slug)),
        ),
      ).toBe(true);
    });

    it('should handle sorting by name', async () => {
      // Arrange
      const queryWithNameSort = {
        ...baseQuery,
        sortBy: PokemonSortBy.name,
        sortDir: PokemonSortDir.desc,
      };
      repository.findAndCount.mockResolvedValue([
        mockPokemon,
        mockPokemon.length,
      ]);

      // Act
      await service.getAllFilteredPokemon({
        user: mockUser,
        query: queryWithNameSort,
      });

      // Assert
      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          orderBy: { name: 'desc' },
        }),
      );
    });

    it('should handle sorting by pokedexId', async () => {
      // Arrange
      const queryWithIdSort = {
        ...baseQuery,
        sortBy: PokemonSortBy.pokedexId,
        sortDir: PokemonSortDir.asc,
      };
      repository.findAndCount.mockResolvedValue([
        mockPokemon,
        mockPokemon.length,
      ]);

      // Act
      await service.getAllFilteredPokemon({
        user: mockUser,
        query: queryWithIdSort,
      });

      // Assert
      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          orderBy: { pokedexId: 'asc' },
        }),
      );
    });

    it('should calculate pagination correctly', async () => {
      // Arrange
      const queryWithPagination = {
        ...baseQuery,
        page: 2,
        limit: 1,
      };
      repository.findAndCount.mockResolvedValue([[mockPokemon[1]], 2]);

      // Act
      const result = await service.getAllFilteredPokemon({
        user: mockUser,
        query: queryWithPagination,
      });

      // Assert
      expect(result).toEqual({
        data: expect.any(Array) as PokemonListResponseDto[],
        recordCount: 2,
        currentPage: queryWithPagination.page,
        nextPage: null,
        previousPage: 1,
        pageCount: 2,
      });
      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          limit: 1,
          offset: 1,
        }),
      );
    });

    it('should calculate page count correctly when there are more pokemons', async () => {
      // Arrange
      const queryWithPagination = {
        ...baseQuery,
        page: 3,
        limit: 2,
      };
      repository.findAndCount.mockResolvedValue([
        mockPokemon,
        mockPokemon.length,
      ]);

      // Act
      const result = await service.getAllFilteredPokemon({
        user: mockUser,
        query: queryWithPagination,
      });

      // Assert
      expect(result).toEqual({
        data: expect.any(Array) as PokemonListResponseDto[],
        recordCount: mockPokemon.length,
        currentPage: queryWithPagination.page,
        nextPage: 4,
        previousPage: 2,
        pageCount: Math.ceil(mockPokemon.length / queryWithPagination.limit),
      });
    });

    it('should handle empty results', async () => {
      // Arrange
      repository.findAndCount.mockResolvedValue([[], 0]);

      // Act
      const result = await service.getAllFilteredPokemon({
        user: mockUser,
        query: baseQuery,
      });

      // Assert
      expect(result).toEqual({
        data: [],
        recordCount: 0,
        currentPage: 1,
        nextPage: null,
        previousPage: null,
        pageCount: 0,
      });
    });

    it('should handle favorites filtering when user is provided', async () => {
      // Arrange
      const queryWithFavorites = { ...baseQuery, favorites: true };
      repository.findAndCount.mockResolvedValue([
        mockPokemon,
        mockPokemon.length,
      ]);

      // Act
      const result = await service.getAllFilteredPokemon({
        user: mockUser,
        query: queryWithFavorites,
      });

      // Assert
      expect(result.recordCount).toBe(mockPokemon.length);
      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          favorites: expect.objectContaining({
            user: expect.objectContaining({
              id: mockUser.id,
            }),
          }),
        }),
        expect.any(Object),
      );
    });

    it('should throw UnauthorizedException when favorites filtering but user is not provided', async () => {
      // Arrange
      const queryWithFavorites = { ...baseQuery, favorites: true };
      repository.findAndCount.mockResolvedValue([
        mockPokemon,
        mockPokemon.length,
      ]);

      // Act
      await expect(
        service.getAllFilteredPokemon({
          query: queryWithFavorites,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ServiceUnavailableException when repository errors', async () => {
      // Arrange
      const errorMessage = 'Database connection failed';
      repository.findAndCount.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(
        service.getAllFilteredPokemon({
          user: mockUser,
          query: baseQuery,
        }),
      ).rejects.toThrow(ServiceUnavailableException);
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPokemonByName', () => {
    it('should return pokemon detail by name successfully', async () => {
      // Arrange
      const pokemonName = 'Bulbasaur';
      const expectedPokemon = mockPokemon[0];
      repository.findOne.mockResolvedValue(expectedPokemon);

      // Act
      const result = await service.getPokemonByName({ name: pokemonName });

      // Assert
      expect(result).toBeDefined();
      expect(result).toMatchObject({
        id: convertIdToPokedexIdString(expectedPokemon.pokedexId),
        name: expectedPokemon.name,
        classification: expectedPokemon.classification.name,
        types: expectedPokemon.types,
        resistant: expectedPokemon.resistant,
        weaknesses: expectedPokemon.weaknesses,
        weightMax: convertGramsToKilogramsString(expectedPokemon.weightMax),
        weightMin: convertGramsToKilogramsString(expectedPokemon.weightMin),
        heightMax: convertCmToMetrsString(expectedPokemon.heightMax),
        heightMin: convertCmToMetrsString(expectedPokemon.heightMin),
        attacks: expectedPokemon.attacks,
        evolutions: expectedPokemon.evolutions,
        previousEvolutions: expectedPokemon.previousEvolutions,
        maxCP: expectedPokemon.maxCP,
        maxHP: expectedPokemon.maxHP,
        fleeRate: expectedPokemon.fleeRate,
        isLegendary: expectedPokemon.isLegendary,
        isMythical: expectedPokemon.isMythical,
      });
    });

    it('should throw NotFoundException when pokemon not found by name', async () => {
      // Arrange
      const pokemonName = 'NonExistentPokemon';
      repository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.getPokemonByName({ name: pokemonName }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should use case-insensitive search for pokemon name', async () => {
      // Arrange
      const pokemonName = 'BULBASAUR';
      const expectedPokemon = mockPokemon[0];
      repository.findOne.mockResolvedValue(expectedPokemon);

      // Act
      await service.getPokemonByName({ name: pokemonName });

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith(
        { name: { $ilike: pokemonName } },
        expect.any(Object),
      );
    });
  });

  describe('getPokemonByPokedexId', () => {
    it('should return pokemon detail by pokedexId successfully', async () => {
      // Arrange
      const pokedexId = 1;
      const expectedPokemon = mockPokemon[0];
      repository.findOne.mockResolvedValue(expectedPokemon);

      // Act
      const result = await service.getPokemonByPokedexId({ pokedexId });

      // Assert
      expect(result).toBeDefined();
      expect(result).toMatchObject({
        id: convertIdToPokedexIdString(expectedPokemon.pokedexId),
        name: expectedPokemon.name,
        types: expectedPokemon.types,
        resistant: expectedPokemon.resistant,
        weaknesses: expectedPokemon.weaknesses,
        weightMax: convertGramsToKilogramsString(expectedPokemon.weightMax),
        weightMin: convertGramsToKilogramsString(expectedPokemon.weightMin),
        heightMax: convertCmToMetrsString(expectedPokemon.heightMax),
        heightMin: convertCmToMetrsString(expectedPokemon.heightMin),
        attacks: expectedPokemon.attacks,
        evolutions: expectedPokemon.evolutions,
        previousEvolutions: expectedPokemon.previousEvolutions,
        classification: expectedPokemon.classification.name,
        maxCP: expectedPokemon.maxCP,
        maxHP: expectedPokemon.maxHP,
        fleeRate: expectedPokemon.fleeRate,
        isLegendary: expectedPokemon.isLegendary,
        isMythical: expectedPokemon.isMythical,
      });
    });

    it('should throw NotFoundException when pokemon not found by pokedexId', async () => {
      // Arrange
      const pokedexId = 999;
      repository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.getPokemonByPokedexId({ pokedexId }),
      ).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith(
        { pokedexId },
        expect.any(Object),
      );
    });

    it('should use exact match for pokedexId search', async () => {
      // Arrange
      const pokedexId = 4;
      const expectedPokemon = mockPokemon[1]; // Charmander with pokedexId 4
      repository.findOne.mockResolvedValue(expectedPokemon);

      // Act
      const result = await service.getPokemonByPokedexId({ pokedexId });

      // Assert
      expect(result.name).toBe(expectedPokemon.name);
      expect(repository.findOne).toHaveBeenCalledWith(
        { pokedexId },
        expect.any(Object),
      );
    });
  });
});
