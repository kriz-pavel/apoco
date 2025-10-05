import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Classification {
  @PrimaryKey({ type: 'smallint' })
  id!: number;

  @Property({ unique: true })
  name!: string;

  @Property({ type: Date, defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ type: Date, defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
