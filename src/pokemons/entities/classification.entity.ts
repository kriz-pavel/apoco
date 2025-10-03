import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Classification {
  @ApiProperty({ description: 'The ID of the classification', example: 1 })
  @PrimaryKey({ type: 'smallint' })
  id!: number;

  @ApiProperty({
    description: 'The name of the classification',
    example: 'Mouse Pokémon',
  })
  @Property({ unique: true })
  name!: string;

  @ApiProperty({
    description: 'The date and time the classification was created',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ type: Date, defaultRaw: 'now()' })
  createdAt!: Date;

  @ApiProperty({
    description: 'The date and time the classification was updated',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ type: Date, defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
