import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Evolution } from './evolution.entity';

@Entity()
export class Candy {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  name!: string;

  @OneToMany(() => Evolution, (e) => e.candy)
  evolutions = new Collection<Evolution>(this);
}
