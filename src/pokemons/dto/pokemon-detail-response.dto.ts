import { PokemonType } from 'src/pokemon-types/entities/pokemon-type.entity';
import { AttackCategory } from 'src/pokemons/entities/attack.entity';

type EvolutionRequirements = {
  candy: string;
  candyAmount: number;
};

type PokemonEvolution = {
  id: string;
  name: string;
};

export class PokemonDetailResponseDto {
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
  weightMax: string;
  weightMin: string;
  heightMax: string;
  heightMin: string;
  maxCP: number;
  maxHP: number;
  fleeRate: number;
  isLegendary: boolean;
  isMythical: boolean;
  commonCaptureArea: string | null;
  evolutionRequirements: EvolutionRequirements;
  evolutions: PokemonEvolution[];
  previousEvolutions: PokemonEvolution[];
}
