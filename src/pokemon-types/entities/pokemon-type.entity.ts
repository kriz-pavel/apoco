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

@Entity()
export class PokemonType extends BaseEntity {
  [OptionalProps]?: 'slug';

  @PrimaryKey({ hidden: true })
  id!: number;

  @Property({ unique: true, index: true })
  slug!: string;

  @Property({ unique: true })
  name!: string;

  @BeforeCreate()
  @BeforeUpdate()
  @BeforeUpsert()
  setSlug() {
    this.slug = convertToSlug(this.name);
  }
}

function convertToSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}
