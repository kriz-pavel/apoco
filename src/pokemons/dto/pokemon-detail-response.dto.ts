import { ApiProperty } from '@nestjs/swagger';
import { PokemonType } from '../../pokemon-types/entities/pokemon-type.entity';
import { AttackCategory } from '../../pokemons/entities/attack.entity';

type EvolutionRequirements = {
  candy: string;
  candyAmount: number;
};

type PokemonEvolution = {
  id: string;
  name: string;
};

type PokemonTypeProjection = {
  name: PokemonType['name'];
  slug: PokemonType['slug'];
};

export class PokemonDetailResponseDto {
  @ApiProperty({ description: 'The Pokedex ID of the Pokemon', example: '001' })
  id: string;

  @ApiProperty({ description: 'The name of the Pokemon', example: 'Pikachu' })
  name: string;

  @ApiProperty({
    description: 'The classification of the Pokemon',
    example: 'Mouse Pokémon',
  })
  classification: string;

  @ApiProperty({ description: 'The attacks of the Pokemon' })
  attacks: {
    name: string;
    type: PokemonTypeProjection;
    damage: number;
    category: AttackCategory;
  }[];

  @ApiProperty({
    description: 'The types of the Pokemon',
    example: ['Electric'],
  })
  types: PokemonTypeProjection[];

  @ApiProperty({
    description: 'The resistant types of the Pokemon',
    example: ['Electric', 'Flying', 'Steel'],
  })
  resistant: PokemonTypeProjection[];

  @ApiProperty({
    description: 'The weaknesses of the Pokemon',
    example: ['Ground'],
  })
  weaknesses: PokemonTypeProjection[];

  @ApiProperty({
    description: 'The weight of the Pokemon in Kilograms',
    example: '5.25kg',
  })
  weightMax: string;

  @ApiProperty({ description: 'The weight of the Pokemon', example: '6.75kg' })
  weightMin: string;

  @ApiProperty({
    description: 'The height of the Pokemon in meters',
    example: '0.35m',
  })
  heightMax: string;

  @ApiProperty({
    description: 'The height of the Pokemon in meters',
    example: '0.45m',
  })
  heightMin: string;

  @ApiProperty({ description: 'The max CP of the Pokemon', example: 777 })
  maxCP: number;

  @ApiProperty({ description: 'The max HP of the Pokemon', example: 887 })
  maxHP: number;

  @ApiProperty({ description: 'The flee rate of the Pokemon', example: 0.1 })
  fleeRate: number;

  @ApiProperty({
    description: 'Whether the Pokemon is legendary',
    example: false,
  })
  isLegendary: boolean;

  @ApiProperty({
    description: 'Whether the Pokemon is mythical',
    example: false,
  })
  isMythical: boolean;

  @ApiProperty({
    description: 'The common capture area of the Pokemon',
    example: 'Australia, New Zealand',
  })
  commonCaptureArea: string | null;

  @ApiProperty({
    description: 'The evolution requirements of the Pokemon',
    example: { candy: 'Pikachu candies', candyAmount: 50 },
  })
  evolutionRequirements: EvolutionRequirements;

  @ApiProperty({
    description: 'The evolutions of the Pokemon',
    example: [{ id: '026', name: 'Raichu' }],
  })
  evolutions: PokemonEvolution[];

  @ApiProperty({ description: 'The previous evolutions of the Pokemon' })
  previousEvolutions: PokemonEvolution[];
}
