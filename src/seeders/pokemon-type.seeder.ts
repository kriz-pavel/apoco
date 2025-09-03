import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { PokemonType } from '../pokemon-type/pokemon-type.entity';
import { seedPokemonData } from './data/data';
import { PokemonTypeName } from './data/seed-pokemon.types';

export class PokemonTypeSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const typeNames = seedPokemonData.reduce(
      (result, current) => {
        result.push(...current.types);
        return result;
      },
      <PokemonTypeName[]>[],
    );
    const uniqueTypeNames = [...new Set(typeNames)];
    console.log(`Seeding ${uniqueTypeNames.length} Types...`);

    let createdCount = 0;
    for (const name of uniqueTypeNames) {
      const exists = await em.findOne(PokemonType, { name });
      if (!exists) {
        em.persist(em.create(PokemonType, { name }));
        createdCount++;
      }
    }

    await em.flush();

    console.log(`Created ${createdCount} new Pokemon Type entries`);
    console.log(
      `Skipped ${uniqueTypeNames.length - createdCount} existing Pokemon Type entries`,
    );
  }
}
