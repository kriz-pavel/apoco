import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { seedPokemonData as pokemons } from './data/data';
import { PokemonType } from '../pokemon-type/pokemon-type.entity';
import { Classification } from '../pokemon/entities/classification.entity';
import { PokemonTypeName } from './data/seed-pokemon.types';
import { Attack } from '../pokemon/entities/attack.entity';

export class PokemonSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(`Seeding ${pokemons.length} Pokemon...`);

    const types = await em.find(PokemonType, {});
    const typesMap = new Map(
      types.map((type) => [type.name as PokemonTypeName, type]),
    );
    const classifications = await em.find(Classification, {});
    const classificationsMap = new Map(
      classifications.map((classification) => [
        classification.name,
        classification,
      ]),
    );
    const attacks = await em.find(Attack, {});
    const attacksMap = new Map(attacks.map((attack) => [attack.name, attack]));

    let createdCount = 0;
    for (const pokemon of pokemons) {
      const types = pokemon.types.map((type) => typesMap.get(type)!);
      const resistant = pokemon.resistant.map((type) => typesMap.get(type)!);
      const weaknesses = pokemon.weaknesses.map((type) => typesMap.get(type)!);
      const attacks = [
        ...pokemon.attacks.fast.map((attack) => attacksMap.get(attack.name)!),
        ...pokemon.attacks.special.map(
          (attack) => attacksMap.get(attack.name)!,
        ),
      ];

      const pokemonData = em.create(Pokemon, {
        name: pokemon.name,
        pokedexId: Number(pokemon.id),
        classification: classificationsMap.get(pokemon.classification)!,
        weightMax: this.getNormalizedWeightInGrams(pokemon.weight.maximum),
        weightMin: this.getNormalizedWeightInGrams(pokemon.weight.minimum),
        heightMax: this.getNormalizedHeightInCm(pokemon.height.maximum),
        heightMin: this.getNormalizedHeightInCm(pokemon.height.minimum),
        fleeRate: pokemon.fleeRate,
        maxCP: pokemon.maxCP,
        maxHP: pokemon.maxHP,
        isLegendary: !!pokemon.LEGENDARY,
        isMythical: !!pokemon.MYTHIC,
        commonCaptureArea: pokemon['Common Capture Area'] || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      pokemonData.types.add(types);
      pokemonData.resistant.add(resistant);
      pokemonData.weaknesses.add(weaknesses);
      pokemonData.attacks.add(attacks);

      em.persist(pokemonData);
      createdCount++;
    }
    await em.flush();

    console.log(`Created ${createdCount} new Pokemon entries`);
  }

  private getNormalizedWeightInGrams(weight: string): number {
    const normalizedWeight = Number(weight.replace('kg', '').trim()) * 1000;
    if (isNaN(normalizedWeight)) {
      throw new Error(`Invalid weight: ${weight}`);
    }
    return normalizedWeight;
  }

  private getNormalizedHeightInCm(height: string): number {
    const normalizedHeight = Number(height.replace('m', '').trim()) * 100;
    if (isNaN(normalizedHeight)) {
      throw new Error(`Invalid height: ${height}`);
    }
    return normalizedHeight;
  }
}
