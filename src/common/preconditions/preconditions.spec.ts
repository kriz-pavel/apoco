import { Test, TestingModule } from '@nestjs/testing';
import { PreconditionsService } from './preconditions';

describe('PreconditionsService', () => {
  let service: PreconditionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreconditionsService],
    }).compile();

    service = module.get<PreconditionsService>(PreconditionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
