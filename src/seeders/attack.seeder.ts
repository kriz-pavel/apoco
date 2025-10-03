import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { seedPokemonData } from './data/data';
import { Attack, AttackCategory } from '../pokemons/entities/attack.entity';
import { PokemonType } from '../pokemon-types/entities/pokemon-type.entity';
import { PokemonTypeName } from './data/seed-pokemon.types';
import { checkExists } from '../common/preconditions/preconditions';

type AttackData = Pick<Attack, 'name' | 'type' | 'damage' | 'category'>;

export class AttackSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const types = await em.find(PokemonType, {});
    const typesMap = new Map(
      types.map((type) => [type.name as PokemonTypeName, type]),
    );

    const attacksByNameMap = seedPokemonData.reduce((map, current) => {
      if (current.attacks.fast) {
        current.attacks.fast.forEach((attack) => {
          const obj: AttackData = {
            name: attack.name,
            type: checkExists(
              typesMap.get(attack.type),
              `Attack type ${attack.type} not found`,
            ),
            damage: attack.damage,
            category: AttackCategory.FAST,
          };

          if (!map.has(obj.name)) {
            map.set(obj.name, obj);
          }
        });
      }

      if (current.attacks.special) {
        current.attacks.special.forEach((attack) => {
          const obj: AttackData = {
            name: attack.name,
            type: checkExists(
              typesMap.get(attack.type),
              `Attack type ${attack.type} not found`,
            ),
            damage: attack.damage,
            category: AttackCategory.SPECIAL,
          };

          if (!map.has(obj.name)) {
            map.set(obj.name, obj);
          }
        });
      }

      return map;
    }, new Map<string, AttackData>());
    const uniqueAttacks = Array.from(attacksByNameMap.values());

    await em.insertMany(Attack, uniqueAttacks);
  }
}
