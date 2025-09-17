// evolution.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Pokemon } from './pokemon.entity';
import { Candy } from './candy.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Evolution {
  @ApiProperty({ description: 'The ID of the evolution', example: 1 })
  @PrimaryKey()
  id!: number;

  @ApiProperty({ description: 'The Pokemon that evolves from', example: 1 })
  @ManyToOne(() => Pokemon, {
    index: true,
    deleteRule: 'cascade',
  })
  fromPokemon!: Pokemon;

  @ApiProperty({ description: 'The Pokemon that evolves to', example: 1 })
  @ManyToOne(() => Pokemon, {
    unique: true,
    deleteRule: 'cascade',
  })
  toPokemon!: Pokemon;

  @ApiProperty({
    description: 'The Candy that is required for the evolution',
    example: 1,
  })
  @ManyToOne(() => Candy)
  candy!: Candy;

  @ApiProperty({
    description: 'The amount of Candy required for the evolution',
    example: 1,
  })
  @Property({ columnType: 'smallint' })
  candyAmount!: number;
}
