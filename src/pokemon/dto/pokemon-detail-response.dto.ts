import { ApiProperty } from '@nestjs/swagger';
import { AttackCategory } from '../entities/attack.entity';

export class EvolutionRequirementsDto {
  @ApiProperty({
    type: String,
    description: 'The name of the candy',
    example: 'Pikachu candies',
  })
  candy: string;

  @ApiProperty({
    type: Number,
    description: 'The amount of candy',
    example: 50,
  })
  candyAmount: number;
}

export class PokemonEvolutionDto {
  @ApiProperty({
    type: String,
    description: 'The Pokedex ID of the Pokemon',
    example: '026',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the Pokemon',
    example: 'Raichu',
  })
  name: string;
}

export class PokemonTypeDto {
  @ApiProperty({
    type: String,
    description: 'The name of the Pokemon type',
    example: 'Electric',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'The slug of the Pokemon type',
    example: 'electric',
  })
  slug: string;
}

export class AttackDto {
  @ApiProperty({
    type: String,
    description: 'The name of the attack',
    example: 'Thunderbolt',
  })
  name: string;

  type: PokemonTypeDto;

  @ApiProperty({
    type: Number,
    description: 'The damage of the attack',
    example: 90,
  })
  damage: number;

  @ApiProperty({
    enum: AttackCategory,
    description: 'The category of the attack',
    example: 'fast',
  })
  category: AttackCategory;
}

export class PokemonDetailResponseDto {
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

  @ApiProperty({
    type: [AttackDto],
    description: 'The attacks of the Pokemon',
    example: [
      {
        name: 'Thunderbolt',
        type: { name: 'Electric', slug: 'electric' },
        damage: 90,
        category: 'fast',
      },
    ],
  })
  attacks: AttackDto[];

  @ApiProperty({
    type: [PokemonTypeDto],
    description: 'The types of the Pokemon',
    example: [{ name: 'Electric', slug: 'electric' }],
  })
  types: PokemonTypeDto[];

  @ApiProperty({
    type: [PokemonTypeDto],
    description: 'The resistant types of the Pokemon',
    example: [{ name: 'Electric', slug: 'electric' }],
  })
  resistant: PokemonTypeDto[];

  @ApiProperty({
    type: [PokemonTypeDto],
    description: 'The weaknesses of the Pokemon',
    example: [{ name: 'Electric', slug: 'electric' }],
  })
  weaknesses: PokemonTypeDto[];

  @ApiProperty({
    type: String,
    description: 'The weight of the Pokemon in Kilograms',
    example: '5.25kg',
  })
  weightMax: string;

  @ApiProperty({
    type: String,
    description: 'The weight of the Pokemon',
    example: '6.75kg',
  })
  weightMin: string;

  @ApiProperty({
    type: String,
    description: 'The height of the Pokemon in meters',
    example: '0.35m',
  })
  heightMax: string;

  @ApiProperty({
    type: String,
    description: 'The height of the Pokemon in meters',
    example: '0.45m',
  })
  heightMin: string;

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
    type: Boolean,
    description: 'Whether the Pokemon is legendary',
    example: false,
  })
  isLegendary: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the Pokemon is mythical',
    example: false,
  })
  isMythical: boolean;

  @ApiProperty({
    type: String,
    description: 'The common capture area of the Pokemon',
    example: 'Australia, New Zealand',
    nullable: true,
  })
  commonCaptureArea: string | null;

  @ApiProperty({
    type: EvolutionRequirementsDto,
    description: 'The evolution requirements of the Pokemon',
    example: { candy: 'Pikachu candies', candyAmount: 50 },
    nullable: true,
  })
  evolutionRequirements: EvolutionRequirementsDto | null;

  @ApiProperty({
    type: [PokemonEvolutionDto],
    description: 'The evolutions of the Pokemon',
    example: [{ id: '026', name: 'Raichu' }],
  })
  evolutions: PokemonEvolutionDto[];

  @ApiProperty({
    type: [PokemonEvolutionDto],
    description: 'The previous evolutions of the Pokemon',
    example: [{ id: '026', name: 'Raichu' }],
  })
  previousEvolutions: PokemonEvolutionDto[];
}
