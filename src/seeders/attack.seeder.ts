import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { z } from 'zod';
import { seedPokemonData } from './data/data';
import { Attack, AttackCategory } from '../pokemon/entities/attack.entity';
import { PokemonType } from '../pokemon-types/entities/pokemon-type.entity';
import {
  PokemonTypeName,
  Attack as RawAttack,
} from './data/seed-pokemon.types';
import { checkExists } from '../common/preconditions/preconditions';

// Zod schema for validating attack data from seed file
const attackSchema = z.object({
  name: z.string().min(1, 'Attack name is required'),
  type: z.string().min(1, 'Attack type is required'),
  damage: z.number().int().nonnegative('Attack damage must be non-negative'),
});

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
          this.validateRawAttack(attack);

          const attackData: AttackData = {
            name: attack.name,
            type: checkExists(
              typesMap.get(attack.type),
              `Attack type ${attack.type} not found`,
            ),
            damage: attack.damage,
            category: AttackCategory.FAST,
          };

          if (!map.has(attackData.name)) {
            map.set(attackData.name, attackData);
          }
        });
      }

      if (current.attacks.special) {
        current.attacks.special.forEach((attack) => {
          this.validateRawAttack(attack);

          const attackData: AttackData = {
            name: attack.name,
            type: checkExists(
              typesMap.get(attack.type),
              `Attack type ${attack.type} not found`,
            ),
            damage: attack.damage,
            category: AttackCategory.SPECIAL,
          };

          if (!map.has(attackData.name)) {
            map.set(attackData.name, attackData);
          }
        });
      }

      return map;
    }, new Map<string, AttackData>());
    const uniqueAttacks = Array.from(attacksByNameMap.values());

    await em.insertMany(Attack, uniqueAttacks);
  }

  private validateRawAttack(attack: RawAttack) {
    try {
      attackSchema.parse(attack);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new Error(
          `Attack validation failed for ${attack.name}: ${errors}`,
        );
      }
      throw error;
    }
  }
}
