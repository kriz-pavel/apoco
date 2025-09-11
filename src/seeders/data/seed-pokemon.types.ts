/**
 * Type definitions based on the structure of seed-pokemon.json
 */

export type PokemonTypeName =
  | 'Bug'
  | 'Dark'
  | 'Dragon'
  | 'Electric'
  | 'Fairy'
  | 'Fighting'
  | 'Fire'
  | 'Flying'
  | 'Ghost'
  | 'Grass'
  | 'Ground'
  | 'Ice'
  | 'Normal'
  | 'Poison'
  | 'Psychic'
  | 'Rock'
  | 'Steel'
  | 'Water';

export type PokemonWeight = {
  minimum: string; // e.g., "6.04kg"
  maximum: string; // e.g., "7.76kg"
};

export type PokemonHeight = {
  minimum: string; // e.g., "0.61m"
  maximum: string; // e.g., "0.79m"
};

export type EvolutionRequirements = {
  amount: number;
  name: string; // e.g., "Bulbasaur candies"
};

export type Evolution = {
  id: string;
  name: string;
};

export type Attack = {
  name: string;
  type: PokemonTypeName;
  damage: number;
};

export type PokemonAttacks = {
  fast: Attack[];
  special: Attack[];
};

export type Pokemon = {
  id: string;
  name: string;
  classification: string; // e.g., "Seed Pokémon"
  types: PokemonTypeName[];
  resistant: PokemonTypeName[];
  weaknesses: PokemonTypeName[];
  weight: PokemonWeight;
  height: PokemonHeight;
  LEGENDARY?: string;
  MYTHIC?: string;
  'Common Capture Area'?: string;
  fleeRate: number; // 0-1 range
  evolutionRequirements?: EvolutionRequirements;
  evolutions?: Evolution[];
  'Previous evolution(s)'?: Evolution[];
  maxCP: number;
  maxHP: number;
  attacks: PokemonAttacks;
};

/**
 * Root type for the seed-pokemon.json file
 */
export type PokemonSeedData = Pokemon[];
