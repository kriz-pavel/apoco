import { Test, TestingModule } from '@nestjs/testing';
import { FavoritePokemonsService } from './favorite-pokemons.service';

describe('FavoritePokemonsService', () => {
  let service: FavoritePokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoritePokemonsService],
    }).compile();

    service = module.get<FavoritePokemonsService>(FavoritePokemonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
