import { Test, TestingModule } from '@nestjs/testing';
import { ConversionServiceService } from './conversions';

describe('ConversionServiceService', () => {
  let service: ConversionServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversionServiceService],
    }).compile();

    service = module.get<ConversionServiceService>(ConversionServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
