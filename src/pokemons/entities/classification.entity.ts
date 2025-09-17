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
}
