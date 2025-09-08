import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { seedPokemonData } from './data/data';
import { Attack, AttackCategory } from '../pokemon/entities/attack.entity';
import { PokemonType } from '../pokemon-type/pokemon-type.entity';
import { PokemonTypeName } from './data/seed-pokemon.types';

export class AttackSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(`Seeding Attacks...`);

    const types = await em.find(PokemonType, {});
    const typesMap = new Map(
      types.map((type) => [type.name as PokemonTypeName, type]),
    );

    const attacksByNameMap = seedPokemonData.reduce((map, current) => {
      if (current.attacks.fast) {
        current.attacks.fast.forEach((attack) => {
          const obj: Pick<Attack, 'name' | 'type' | 'damage' | 'category'> = {
            name: attack.name,
            type: typesMap.get(attack.type)!,
            damage: attack.damage,
            category: AttackCategory.FAST,
          };
          if (!map.has(obj.name)) map.set(obj.name, obj);
        });
      }

      if (current.attacks.special) {
        current.attacks.special.forEach((attack) => {
          const obj: Pick<Attack, 'name' | 'type' | 'damage' | 'category'> = {
            name: attack.name,
            type: typesMap.get(attack.type)!,
            damage: attack.damage,
            category: AttackCategory.SPECIAL,
          };
          if (!map.has(obj.name)) map.set(obj.name, obj);
        });
      }

      return map;
    }, new Map<string, Pick<Attack, 'name' | 'type' | 'damage' | 'category'>>());
    const uniqueAttacks = Array.from(attacksByNameMap.values());

    await em.insertMany(Attack, uniqueAttacks);

    console.log(`Created ${uniqueAttacks.length} new Attack entries`);
  }
}
