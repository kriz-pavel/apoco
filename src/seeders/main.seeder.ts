import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { PokemonSeeder } from './pokemon.seeder';

export class MainSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [PokemonSeeder]);
  }
}
