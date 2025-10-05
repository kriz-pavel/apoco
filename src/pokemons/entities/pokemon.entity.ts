import {
  BaseEntity,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Classification } from './classification.entity';
import { PokemonType } from 'src/pokemon-types/entities/pokemon-type.entity';
import { Attack } from './attack.entity';
import { Evolution } from './evolution.entity';
import { FavoritePokemon } from '../../favorite-pokemons/entities/favorite-pokemon.entity';

@Entity()
export class Pokemon extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey({ hidden: true })
  id!: number;

  // stable public id based on pokedex id
  @Property({
    unique: true,
    type: 'smallint',
    check: 'pokedex_id > 0',
  })
  pokedexId!: number;

  @Property({ unique: true })
  name!: string;

  @ManyToOne()
  classification!: Classification;

  @ManyToMany({ mappedBy: 'pokemon' })
  attacks = new Collection<Attack>(this);

  @OneToMany(() => FavoritePokemon, (fav) => fav.pokemon)
  favorites = new Collection<FavoritePokemon>(this);

  @ManyToMany({
    pivotTable: 'pokemon_types_pivot',
    joinColumn: 'pokemon_id',
    inverseJoinColumn: 'type_id',
  })
  types = new Collection<PokemonType>(this);

  @ManyToMany({
    pivotTable: 'pokemon_resistant',
    joinColumn: 'pokemon_id',
    inverseJoinColumn: 'type_id',
  })
  resistant = new Collection<PokemonType>(this);

  @ManyToMany({
    pivotTable: 'pokemon_weaknesses',
    joinColumn: 'pokemon_id',
    inverseJoinColumn: 'type_id',
  })
  weaknesses = new Collection<PokemonType>(this);

  // evolutions from this pokemon
  @OneToMany(() => Evolution, (e) => e.fromPokemon)
  evolutions = new Collection<Evolution>(this);

  // previous evolutions of this pokemon
  @OneToMany(() => Evolution, (e) => e.toPokemon)
  previousEvolutions = new Collection<Evolution>(this);

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
