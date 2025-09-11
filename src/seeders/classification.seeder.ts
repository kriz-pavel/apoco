import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { seedPokemonData } from './data/data';
import { Classification } from '../pokemons/entities/classification.entity';

export class ClassificationSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(`Seeding Classifications...`);

    const classificationNames = seedPokemonData.reduce(
      (result, current) => {
        if (current.classification) {
          result.push(current.classification);
        }
        return result;
      },
      <string[]>[],
    );
    const uniqueClassificationNames = [...new Set(classificationNames)];

    await em.insertMany(
      Classification,
      uniqueClassificationNames.map((name) => ({ name })),
    );

    console.log(
      `Created ${uniqueClassificationNames.length} new Classification entries`,
    );
  }
}
