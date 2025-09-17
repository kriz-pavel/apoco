import { ApiProperty } from '@nestjs/swagger';
import { PokemonType } from 'src/pokemon-types/entities/pokemon-type.entity';
import { AttackCategory } from 'src/pokemons/entities/attack.entity';

type PokemonTypeProjection = {
  name: PokemonType['name'];
  slug: PokemonType['slug'];
};

export class PokemonListResponseDto {
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
}
