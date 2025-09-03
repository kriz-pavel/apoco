import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Candy {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  name!: string;
}
