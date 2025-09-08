import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { PokemonType } from '../pokemon-type/pokemon-type.entity';
import { seedPokemonData } from './data/data';
import { PokemonTypeName } from './data/seed-pokemon.types';

export class PokemonTypeSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(`Seeding Types...`);

    const typeNames = seedPokemonData.reduce(
      (result, current) => {
        // Add all type names from the Pokémon data. Since the dataset doesn’t include
        // Pokémon of every type, we’ll explicitly include all types.
        result.push(...current.types);
        result.push(...current.resistant);
        result.push(...current.weaknesses);
        result.push(...current.attacks.fast.map((attack) => attack.type));
        result.push(...current.attacks.special.map((attack) => attack.type));
        return result;
      },
      <PokemonTypeName[]>[],
    );
    const uniqueTypeNames = [...new Set(typeNames)];

    for (const name of uniqueTypeNames) {
      em.persist(em.create(PokemonType, { name }));
    }

    await em.flush();

    console.log(`Created ${uniqueTypeNames.length} new Pokemon Type entries`);
  }
}
