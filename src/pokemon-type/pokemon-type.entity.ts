import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

@Entity()
export class PokemonType {
  [OptionalProps]?: 'slug';

  @PrimaryKey({ hidden: true })
  id!: number;

  @Property({ unique: true, index: true })
  slug!: string;

  @Property({ unique: true })
  name!: string;

  @BeforeCreate()
  @BeforeUpdate()
  setSlug() {
    this.slug = this.name.trim().toLowerCase().replace(/\s+/g, '-');
  }
}
