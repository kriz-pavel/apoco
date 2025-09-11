import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Pokemon } from './entities/pokemon.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly repo: EntityRepository<Pokemon>,
  ) {}

  findAll(): Promise<Pokemon[]> {
    return this.repo.findAll({
      populate: [
        'types',
        'resistant',
        'weaknesses',
        'attacks',
        'evolutions',
        'previousEvolutions',
      ],
      // limit: 10,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }
}
