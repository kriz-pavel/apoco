import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { seedPokemonData as pokemons } from './data/data';

export class PokemonSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(`Seeding ${pokemons.length} Pokemon...`);

    // Extract Pokemon names from the data
    const names = pokemons.map((p) => p.name);

    // Check for existing Pokemon and only create new ones
    let createdCount = 0;
    for (const name of names) {
      const exists = await em.findOne(Pokemon, { name });
      if (!exists) {
        em.persist(em.create(Pokemon, { name }));
        createdCount++;
      }
    }

    await em.flush();

    console.log(`Created ${createdCount} new Pokemon entries`);
    console.log(
      `Skipped ${names.length - createdCount} existing Pokemon entries`,
    );
  }
}
