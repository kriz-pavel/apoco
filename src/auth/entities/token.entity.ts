import {
  BaseEntity,
  Entity,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Token extends BaseEntity {
  [OptionalProps]?: 'isRevoked' | 'createdAt' | 'updatedAt';

  @ApiProperty({ description: 'The ID of the token', example: 1 })
  @PrimaryKey()
  id!: number;

  @ApiProperty({ description: 'The hash of the token' })
  @Property({ unique: true })
  tokenHash!: string;

  @ApiProperty({ description: 'The user who the token belongs to' })
  @ManyToOne()
  user!: User;

  @ApiProperty({
    description: 'The date and time the token expires',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ type: Date })
  expiresAt!: Date;

  @ApiProperty({ description: 'Whether the token is revoked', example: false })
  @Property({ default: false })
  isRevoked!: boolean;

  @ApiProperty({
    description: 'The date and time the token was created',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ type: Date, defaultRaw: 'now()' })
  createdAt!: Date;

  @ApiProperty({
    description: 'The date and time the token was updated',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ type: Date, defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
