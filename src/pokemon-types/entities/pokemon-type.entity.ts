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
import { convertTextToSlug } from '../../common/conversions/conversions';

@Entity()
export class PokemonType extends BaseEntity {
  [OptionalProps]?: 'slug';

  @PrimaryKey({ type: 'smallint', hidden: true })
  id!: number;

  @Property({ unique: true })
  slug!: string;

  @Property({ unique: true })
  name!: string;

  @BeforeCreate()
  @BeforeUpdate()
  @BeforeUpsert()
  setSlug() {
    this.slug = convertTextToSlug(this.name);
  }
}
