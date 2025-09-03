import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Classification {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  name!: string;
}
