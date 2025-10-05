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
  @PrimaryKey({ type: 'smallint' })
  id!: number;

  @Property({ unique: true })
  name!: string;

  @OneToMany(() => Evolution, (e) => e.candy)
  evolutions = new Collection<Evolution>(this);

  @Property({ type: Date, defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ type: Date, defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
