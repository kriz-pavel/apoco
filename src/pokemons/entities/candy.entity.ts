import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Evolution } from './evolution.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Candy {
  @ApiProperty({ description: 'The ID of the candy', example: 1 })
  @PrimaryKey({ type: 'smallint' })
  id!: number;

  @ApiProperty({
    description: 'The name of the candy',
    example: 'Bulbasaur Candy',
  })
  @Property({ unique: true })
  name!: string;

  @ApiProperty({ description: 'The evolutions that use the candy' })
  @OneToMany(() => Evolution, (e) => e.candy)
  evolutions = new Collection<Evolution>(this);

  @ApiProperty({
    description: 'The date and time the candy was created',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ type: Date, defaultRaw: 'now()' })
  createdAt!: Date;

  @ApiProperty({
    description: 'The date and time the candy was updated',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ type: Date, defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
