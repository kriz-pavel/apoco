import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { seedPokemonData } from './data/data';
import { Classification } from '../pokemon/entities/classification.entity';

export class ClassificationSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
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
    console.log(
      `Seeding ${uniqueClassificationNames.length} Classifications...`,
    );

    em.persist(
      await em.upsertMany(
        Classification,
        uniqueClassificationNames.map((name) => ({ name })),
      ),
    );

    await em.flush();

    console.log(`Seeding Classifications completed`);
  }
}
