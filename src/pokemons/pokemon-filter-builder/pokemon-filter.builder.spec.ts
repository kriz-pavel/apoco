import { Test, TestingModule } from '@nestjs/testing';
import { FilterQueryBuilderService } from './filter-query-builder.service';

describe('FilterQueryBuilderService', () => {
  let service: FilterQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilterQueryBuilderService],
    }).compile();

    service = module.get<FilterQueryBuilderService>(FilterQueryBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
