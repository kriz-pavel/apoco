import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { PokemonSeeder } from './pokemon.seeder';
import { PokemonTypeSeeder } from './pokemon-type.seeder';
import { CandySeeder } from './candy.seeder';
import { ClassificationSeeder } from './classification.seeder';

export class MainSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [
      ClassificationSeeder,
      CandySeeder,
      PokemonTypeSeeder,
      PokemonSeeder,
    ]);
  }
}
