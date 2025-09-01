export type TypeName =
  | 'Grass'
  | 'Poison'
  | 'Water'
  | 'Electric'
  | 'Fighting'
  | 'Fairy'
  | 'Fire'
  | 'Ice'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Steel'
  | 'Ground'
  | 'Rock'
  | 'Normal'
  | 'Ghost';

export interface TypeRow {
  id: number;
  name: TypeName; // názvy jsou omezené výše
}

// Tabulka s pokémony
export interface PokemonRow {
  id: number;
  name: string;
  classification: string; // např. "Seed Pokémon"
  max_cp: number;
  max_hp: number;
  flee_rate: number; // 0–1
  weight_min_kg: number;
  weight_max_kg: number;
  height_min_m: number;
  height_max_m: number;
}

// Relace Pokémon ↔ Typ (slot 1/2)
export interface PokemonTypeRow {
  pokemon_id: number; // navazuje na PokemonRow.id
  type_id: number; // navazuje na TypeRow.id
  slot: 1 | 2;
}

// Rezistence pokémona na typy
export interface PokemonResistanceRow {
  pokemon_id: number;
  type_id: number;
}

// Slabiny pokémona na typy
export interface PokemonWeaknessRow {
  pokemon_id: number;
  type_id: number;
}

// Evoluční hrany (směr + cena v candy)
export interface EvolutionEdgeRow {
  from_pokemon_id: number;
  to_pokemon_id: number;
  candy_amount: number;
}

// Kořenový objekt JSONu
export interface SeedPokemonData {
  types: TypeRow[];
  pokemons: PokemonRow[];
  pokemon_types: PokemonTypeRow[];
  pokemon_resistances: PokemonResistanceRow[];
  pokemon_weaknesses: PokemonWeaknessRow[];
  evolution_edges: EvolutionEdgeRow[];
}
