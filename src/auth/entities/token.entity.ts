import {
  BaseEntity,
  Entity,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Token extends BaseEntity {
  [OptionalProps]?: 'isRevoked' | 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  tokenHash!: string;

  @ManyToOne()
  user!: User;

  @Property({ type: Date })
  expiresAt!: Date;

  @Property({ default: false })
  isRevoked!: boolean;

  @Property({ type: Date, defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ type: Date, defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
