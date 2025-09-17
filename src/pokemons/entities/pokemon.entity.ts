import {
  BaseEntity,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Classification } from './classification.entity';
import { PokemonType } from 'src/pokemon-types/entities/pokemon-type.entity';
import { Attack } from './attack.entity';
import { Evolution } from './evolution.entity';
import { FavoritePokemon } from '../../favorite-pokemons/entities/favorite-pokemon.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Pokemon extends BaseEntity {
  @ApiProperty({ description: 'The ID of the Pokemon', example: 1 })
  @PrimaryKey({ hidden: true })
  id!: number;

  // stable public id based on pokedex id
  @ApiProperty({ description: 'The Pokedex ID of the Pokemon', example: '001' })
  @Property({
    unique: true,
    type: 'smallint',
    check: 'pokedex_id > 0',
  })
  pokedexId!: number;

  @ApiProperty({ description: 'The name of the Pokemon', example: 'Bulbasaur' })
  @Property({ unique: true })
  name!: string;

  @ApiProperty({ description: 'The classification of the Pokemon' })
  @ManyToOne()
  classification!: Classification;

  @ApiProperty({ description: 'The attacks of the Pokemon' })
  @ManyToMany({ mappedBy: 'pokemon' })
  attacks = new Collection<Attack>(this);

  @ApiProperty({ description: 'The favorites of the Pokemon' })
  @OneToMany(() => FavoritePokemon, (fav) => fav.pokemon)
  favorites = new Collection<FavoritePokemon>(this);

  @ApiProperty({ description: 'The types of the Pokemon' })
  @ManyToMany({
    pivotTable: 'pokemon_types_pivot',
    joinColumn: 'pokemon_id',
    inverseJoinColumn: 'type_id',
  })
  types = new Collection<PokemonType>(this);

  @ApiProperty({ description: 'The resistant types of the Pokemon' })
  @ManyToMany({
    pivotTable: 'pokemon_resistant',
    joinColumn: 'pokemon_id',
    inverseJoinColumn: 'type_id',
  })
  resistant = new Collection<PokemonType>(this);

  @ApiProperty({ description: 'The weaknesses of the Pokemon' })
  @ManyToMany({
    pivotTable: 'pokemon_weaknesses',
    joinColumn: 'pokemon_id',
    inverseJoinColumn: 'type_id',
  })
  weaknesses = new Collection<PokemonType>(this);

  // evolutions from this pokemon
  @ApiProperty({ description: 'The evolutions from this Pokemon' })
  @OneToMany(() => Evolution, (e) => e.fromPokemon)
  evolutions = new Collection<Evolution>(this);

  // previous evolutions of this pokemon
  @ApiProperty({ description: 'The previous evolutions of this Pokemon' })
  @OneToMany(() => Evolution, (e) => e.toPokemon)
  previousEvolutions = new Collection<Evolution>(this);

  // weight in grams
  @ApiProperty({
    description: 'The maximum weight of the Pokemon in grams',
    example: 100,
  })
  @Property({
    type: 'integer',
    check: 'weight_max >= weight_min and weight_min > 0',
  })
  weightMax!: number;

  // weight in grams
  @ApiProperty({
    description: 'The minimum weight of the Pokemon in grams',
    example: 100,
  })
  @Property({
    type: 'integer',
    check: 'weight_max >= weight_min and weight_min > 0',
  })
  weightMin!: number;

  // height in centimeters
  @ApiProperty({
    description: 'The maximum height of the Pokemon in centimeters',
    example: 100,
  })
  @Property({
    type: 'smallint',
    check: 'height_max >= height_min and height_min > 0',
  })
  heightMax!: number;

  @ApiProperty({
    description: 'The minimum height of the Pokemon in centimeters',
    example: 100,
  })
  @Property({
    type: 'smallint',
    check: 'height_max >= height_min and height_min > 0',
  })
  heightMin!: number;

  @ApiProperty({ description: 'The flee rate of the Pokemon', example: 0.1 })
  @Property({ type: 'decimal', precision: 3, scale: 2 })
  fleeRate!: number;

  @ApiProperty({ description: 'The maximum CP of the Pokemon', example: 100 })
  @Property({ type: 'smallint', check: 'max_cp > 0' })
  maxCP!: number;

  @ApiProperty({ description: 'The maximum HP of the Pokemon', example: 100 })
  @Property({ type: 'smallint', check: 'max_hp > 0' })
  maxHP!: number;

  @ApiProperty({
    description: 'Whether the Pokemon is legendary',
    example: true,
  })
  @Property()
  isLegendary!: boolean;

  @ApiProperty({
    description: 'Whether the Pokemon is mythical',
    example: true,
  })
  @Property()
  isMythical!: boolean;

  @ApiProperty({
    description: 'The common capture area of the Pokemon',
    example: 'Forest',
  })
  @Property({ nullable: true })
  commonCaptureArea!: string | null;

  @ApiProperty({
    description: 'The date and time the Pokemon was created',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ type: Date, defaultRaw: 'now()' })
  createdAt!: Date;

  @ApiProperty({
    description: 'The date and time the Pokemon was updated',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ type: Date, defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
