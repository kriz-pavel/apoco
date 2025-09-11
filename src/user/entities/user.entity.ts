import {
  BaseEntity,
  Collection,
  Entity,
  ManyToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Entity()
export class User extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  email!: string;

  @Property()
  name!: string;

  @ManyToMany({
    pivotTable: 'pokemon_user_pivot',
    joinColumn: 'user_id',
    inverseJoinColumn: 'pokemon_id',
  })
  favorites = new Collection<Pokemon>(this);

  @Property({ type: Date, defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ type: Date, defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
