import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { PokemonTypeService } from './pokemon-type.service';
import { PokemonType } from './pokemon-type.entity';

/* eslint-disable @typescript-eslint/unbound-method */

describe('PokemonTypeService', () => {
  let service: PokemonTypeService;
  let repository: jest.Mocked<EntityRepository<PokemonType>>;

  const mockPokemonTypes: PokemonType[] = [
    {
      id: 1,
      name: 'Grass',
      slug: 'grass',
      setSlug: jest.fn(),
    } as unknown as PokemonType,
    {
      id: 2,
      name: 'Fire',
      slug: 'fire',
      setSlug: jest.fn(),
    } as unknown as PokemonType,
    {
      id: 3,
      name: 'Water',
      slug: 'water',
      setSlug: jest.fn(),
    } as unknown as PokemonType,
    {
      id: 4,
      name: 'Electric',
      slug: 'electric',
      setSlug: jest.fn(),
    } as unknown as PokemonType,
    {
      id: 5,
      name: 'Psychic',
      slug: 'psychic',
      setSlug: jest.fn(),
    } as unknown as PokemonType,
  ];

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      persist: jest.fn(),
      flush: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<EntityRepository<PokemonType>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonTypeService,
        {
          provide: getRepositoryToken(PokemonType),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PokemonTypeService>(PokemonTypeService);
    repository = module.get<EntityRepository<PokemonType>>(
      getRepositoryToken(PokemonType),
    ) as jest.Mocked<EntityRepository<PokemonType>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor and Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have repository injected', () => {
      expect(repository).toBeDefined();
    });

    it('should be instance of PokemonTypeService', () => {
      expect(service).toBeInstanceOf(PokemonTypeService);
    });
  });

  describe('findAll()', () => {
    it('should return all pokemon types successfully', async () => {
      // Arrange
      repository.findAll.mockResolvedValue(mockPokemonTypes);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(mockPokemonTypes);
      expect(result).toHaveLength(5);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(repository.findAll).toHaveBeenCalledWith();
    });

    it('should return empty array when no types exist', async () => {
      // Arrange
      repository.findAll.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return pokemon types with correct structure', async () => {
      // Arrange
      repository.findAll.mockResolvedValue(mockPokemonTypes);

      // Act
      const result = await service.findAll();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      result.forEach((type) => {
        expect(type).toHaveProperty('id');
        expect(type).toHaveProperty('name');
        expect(typeof type.id).toBe('number');
        expect(typeof type.name).toBe('string');
      });

      // Check specific types
      const originalGrassType = mockPokemonTypes.find(
        (type) => type.name === 'Grass',
      );
      const grassType = result.find(
        (type) => type.name === originalGrassType?.name,
      );
      expect(grassType).toBeDefined();
      expect(grassType?.id).toBe(originalGrassType?.id);
      expect(grassType?.name).toBe(originalGrassType?.name);
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const errorMessage = 'Database connection failed';
      repository.findAll.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.findAll()).rejects.toThrow(errorMessage);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle database timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('Query timeout');
      repository.findAll.mockRejectedValue(timeoutError);

      // Act & Assert
      try {
        await service.findAll();
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBe(timeoutError);
        expect(repository.findAll).toHaveBeenCalledTimes(1);
      }
    });

    it('should handle network connectivity errors', async () => {
      // Arrange
      const networkError = new Error('Network unreachable');
      repository.findAll.mockRejectedValue(networkError);

      // Act & Assert
      await expect(service.findAll()).rejects.toThrow('Network unreachable');
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Repository Integration', () => {
    it('should call repository findAll method with no parameters', async () => {
      // Arrange
      repository.findAll.mockResolvedValue(mockPokemonTypes);

      // Act
      await service.findAll();

      // Assert
      expect(repository.findAll).toHaveBeenCalledWith();
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return exact repository response without modification', async () => {
      // Arrange
      const repositoryResponse = [...mockPokemonTypes];
      repository.findAll.mockResolvedValue(repositoryResponse);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toBe(repositoryResponse);
      expect(result).toEqual(mockPokemonTypes);
    });

    it('should handle concurrent calls to findAll', async () => {
      // Arrange
      repository.findAll.mockResolvedValue(mockPokemonTypes);

      // Act
      const [result1, result2, result3] = await Promise.all([
        service.findAll(),
        service.findAll(),
        service.findAll(),
      ]);

      // Assert
      expect(result1).toEqual(mockPokemonTypes);
      expect(result2).toEqual(mockPokemonTypes);
      expect(result3).toEqual(mockPokemonTypes);
      expect(repository.findAll).toHaveBeenCalledTimes(3);
    });
  });
});
