import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { PokemonType } from '../pokemon-type/pokemon-type.entity';
import { seedPokemonData } from './data/data';

export class PokemonTypeSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const types = seedPokemonData.types;
    console.log(`Seeding ${types.length} Types...`);

    const names = types.map((p) => p.name);

    let createdCount = 0;
    for (const name of names) {
      const exists = await em.findOne(PokemonType, { name });
      if (!exists) {
        em.persist(em.create(PokemonType, { name }));
        createdCount++;
      }
    }

    await em.flush();

    console.log(`Created ${createdCount} new Pokemon Type entries`);
    console.log(
      `Skipped ${names.length - createdCount} existing Pokemon Type entries`,
    );
  }
}
