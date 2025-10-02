import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PokemonType } from './entities/pokemon-type.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class PokemonTypeService {
  constructor(
    @InjectRepository(PokemonType)
    private readonly repo: EntityRepository<PokemonType>,
  ) {}

  async findAll() {
    try {
      const info = await this.repo.getEntityManager().getConnection().execute(`
        select current_database() as db,
               current_schema()   as schema,
               inet_server_addr() as host,
               inet_server_port() as port
      `);
      Logger.log(`Connected to: ${JSON.stringify(info[0])}`);
      return await this.repo.findAll();
    } catch {
      throw new ServiceUnavailableException('Failed to fetch Pokemon types');
    }
  }
}
