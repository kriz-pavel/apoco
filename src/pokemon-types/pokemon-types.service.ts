import { Injectable } from '@nestjs/common';
import { PokemonType } from './entities/pokemon-type.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class PokemonTypeService {
  constructor(
    @InjectRepository(PokemonType)
    private readonly repo: EntityRepository<PokemonType>,
  ) {}

  findAll() {
    return this.repo.findAll();
  }
}
