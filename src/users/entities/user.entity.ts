import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { FavoritePokemon } from '../../favorite-pokemon/entities/favorite-pokemon.entity';

@Entity()
export class User extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  email!: string;

  @Property()
  name!: string;

  @OneToMany(() => FavoritePokemon, (fav) => fav.user)
  favorites = new Collection<FavoritePokemon>(this);

  @Property({ type: Date, defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ type: Date, defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
