import { PokemonType } from 'src/pokemon-types/entities/pokemon-type.entity';
import { AttackCategory } from 'src/pokemons/entities/attack.entity';

export class PokemonListResponseDto {
  id: string;
  name: string;
  classification: string;
  attacks: {
    name: string;
    type: Partial<PokemonType>;
    damage: number;
    category: AttackCategory;
  }[];
  types: Partial<PokemonType>[];
  resistant: Partial<PokemonType>[];
  weaknesses: Partial<PokemonType>[];
  maxCP: number;
  maxHP: number;
  fleeRate: number;
  isLegendary: boolean;
  isMythical: boolean;
}
