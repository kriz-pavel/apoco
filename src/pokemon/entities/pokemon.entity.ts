import {
  BaseEntity,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Classification } from './classification.entity';
import { PokemonType } from 'src/pokemon-type/pokemon-type.entity';
import { Attack } from './attack.entity';

@Entity()
export class Pokemon extends BaseEntity {
  @PrimaryKey({ hidden: true })
  id!: number;

  // stable public id based on pokedex id
  @Property({
    unique: true,
    index: true,
    type: 'smallint',
    check: 'pokedex_id > 0',
  })
  pokedexId!: number;

  @Property({ unique: true, index: true })
  name!: string;

  @ManyToOne()
  classification!: Classification;

  @ManyToMany({ mappedBy: 'pokemon' })
  attacks = new Collection<Attack>(this);

  @ManyToMany({ mappedBy: 'pokemon' })
  types = new Collection<PokemonType>(this);

  @ManyToMany({ mappedBy: 'pokemon' })
  resistant = new Collection<PokemonType>(this);

  @ManyToMany({ mappedBy: 'pokemon' })
  weaknesses = new Collection<PokemonType>(this);

  // weight in grams
  @Property({
    type: 'integer',
    check: 'weight_max >= weight_min and weight_min > 0',
  })
  weightMax!: number;

  // weight in grams
  @Property({
    type: 'integer',
    check: 'weight_max >= weight_min and weight_min > 0',
  })
  weightMin!: number;

  // height in centimeters
  @Property({
    type: 'smallint',
    check: 'height_max >= height_min and height_min > 0',
  })
  heightMax!: number;

  @Property({
    type: 'smallint',
    check: 'height_max >= height_min and height_min > 0',
  })
  heightMin!: number;

  @Property({ type: 'decimal', precision: 3, scale: 2 })
  fleeRate!: number;

  @Property({ type: 'smallint', check: 'max_cp > 0' })
  maxCP!: number;

  @Property({ type: 'smallint', check: 'max_hp > 0' })
  maxHP!: number;

  @Property()
  isLegendary!: boolean;

  @Property()
  isMythical!: boolean;

  @Property({ nullable: true })
  commonCaptureArea!: string | null;

  @Property({ type: Date, defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ type: Date, defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
