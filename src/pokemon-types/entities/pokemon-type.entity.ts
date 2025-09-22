import {
  BaseEntity,
  BeforeCreate,
  BeforeUpdate,
  BeforeUpsert,
  Entity,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { convertTextToSlug } from '../../common/conversions/conversions';

@Entity()
export class PokemonType extends BaseEntity {
  [OptionalProps]?: 'slug';

  @ApiProperty({ description: 'The ID of the Pokemon type', example: 1 })
  @PrimaryKey({ type: 'smallint', hidden: true })
  id!: number;

  @ApiProperty({ description: 'The slug of the Pokemon type', example: 'fire' })
  @Property({ unique: true })
  slug!: string;

  @ApiProperty({ description: 'The name of the Pokemon type', example: 'Fire' })
  @Property({ unique: true })
  name!: string;

  @BeforeCreate()
  @BeforeUpdate()
  @BeforeUpsert()
  setSlug() {
    this.slug = convertTextToSlug(this.name);
  }
}
