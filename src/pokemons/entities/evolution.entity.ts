// evolution.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Pokemon } from './pokemon.entity';
import { Candy } from './candy.entity';

@Entity()
export class Evolution {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Pokemon, {
    index: true,
    deleteRule: 'cascade',
  })
  fromPokemon!: Pokemon;

  @ManyToOne(() => Pokemon, {
    index: true,
    unique: true,
    deleteRule: 'cascade',
  })
  toPokemon!: Pokemon;

  @ManyToOne(() => Candy)
  candy!: Candy;

  @Property({ columnType: 'smallint' })
  candyAmount!: number;
}
