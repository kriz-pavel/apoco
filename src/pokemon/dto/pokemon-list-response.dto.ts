import { ApiProperty } from '@nestjs/swagger';
import { AttackDto } from './attack.dto';
import { PokemonTypeDto } from './pokemon-type.dto';
import { Rarity } from '../entities/pokemon.entity';

export class PokemonListDto {
  @ApiProperty({
    type: String,
    description: 'The Pokedex ID of the Pokemon',
    example: '001',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the Pokemon',
    example: 'Pikachu',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'The classification of the Pokemon',
    example: 'Mouse Pokémon',
  })
  classification: string;

  @ApiProperty({ type: [AttackDto], description: 'The attacks of the Pokemon' })
  attacks: AttackDto[];

  @ApiProperty({
    type: [PokemonTypeDto],
    description: 'The types of the Pokemon',
  })
  types: PokemonTypeDto[];

  @ApiProperty({
    type: [PokemonTypeDto],
    description: 'The resistant types of the Pokemon',
  })
  resistant: PokemonTypeDto[];

  @ApiProperty({
    type: [PokemonTypeDto],
    description: 'The weaknesses of the Pokemon',
  })
  weaknesses: PokemonTypeDto[];

  @ApiProperty({
    type: Number,
    description: 'The max CP of the Pokemon',
    example: 777,
  })
  maxCP: number;

  @ApiProperty({
    type: Number,
    description: 'The max HP of the Pokemon',
    example: 887,
  })
  maxHP: number;

  @ApiProperty({
    type: Number,
    description: 'The flee rate of the Pokemon',
    example: 0.1,
  })
  fleeRate: number;

  @ApiProperty({
    enum: Rarity,
    description: 'The rarity of the Pokemon',
    example: Rarity.BASIC,
  })
  rarity: Rarity;
}

export class PokemonListResponseDto {
  @ApiProperty({
    type: [PokemonListDto],
    description: 'The list of Pokemon',
    example: [PokemonListDto],
  })
  data: PokemonListDto[];

  @ApiProperty({ type: Number, description: 'The current page', example: 1 })
  currentPage: number;

  @ApiProperty({ type: Number, description: 'The total pages', example: 1 })
  pageCount: number;

  @ApiProperty({ type: Number, description: 'The total items', example: 1 })
  recordCount: number;

  @ApiProperty({
    type: Number,
    nullable: true,
    description: 'The next page',
    example: 1,
  })
  nextPage: number | null;

  @ApiProperty({
    type: Number,
    nullable: true,
    description: 'The previous page',
    example: 0,
  })
  previousPage: number | null;
}
