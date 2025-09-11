import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { seedPokemonData } from './data/data';
import { Candy } from '../pokemons/entities/candy.entity';

export class CandySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(`Seeding Candies...`);

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

    await em.insertMany(
      Candy,
      uniqueCandyNames.map((name) => ({ name })),
    );

    console.log(`Created ${uniqueCandyNames.length} new Candy entries`);
  }
}
