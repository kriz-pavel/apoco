import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PokemonType } from './entities/pokemon-type.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class PokemonTypeService {
  constructor(
    @InjectRepository(PokemonType)
    private readonly repo: EntityRepository<PokemonType>,
  ) {}

  async findAll() {
    try {
      return await this.repo.findAll();
    } catch {
      throw new ServiceUnavailableException('Failed to fetch Pokemon types');
    }
  }
}
