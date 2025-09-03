import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { seedPokemonData } from './data/data';
import { Candy } from '../pokemon/entities/candy.entity';

export class CandySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const candyNames = seedPokemonData.reduce(
      (result, current) => {
        if (current.evolutionRequirements) {
          result.push(current.evolutionRequirements.name);
        }
        return result;
      },
      <string[]>[],
    );
    const uniqueCandyNames = [...new Set(candyNames)];
    console.log(`Seeding ${uniqueCandyNames.length} Candies...`);

    em.persist(
      await em.upsertMany(
        Candy,
        uniqueCandyNames.map((name) => ({ name })),
      ),
    );

    await em.flush();

    console.log(`Seeding Candies completed`);
  }
}
