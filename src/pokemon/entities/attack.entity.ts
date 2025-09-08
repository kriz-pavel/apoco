import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { PokemonType } from '../../pokemon-type/pokemon-type.entity';
import { Pokemon } from './pokemon.entity';

export enum AttackCategory {
  FAST = 'fast',
  SPECIAL = 'special',
}

@Entity()
export class Attack {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => PokemonType)
  type!: PokemonType;

  @ManyToMany()
  pokemon = new Collection<Pokemon>(this);

  @Property({ unique: true })
  name!: string;

  @Property({ type: 'smallint', check: 'damage >= 0' })
  damage!: number;

  @Enum(() => AttackCategory)
  category!: AttackCategory;

  @Property({ type: Date, defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ type: Date, defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
