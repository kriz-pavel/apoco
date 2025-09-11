import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Pokemon } from '../pokemons/entities/pokemon.entity';
import { seedPokemonData } from './data/data';
import { PokemonType } from '../pokemon-types/entities/pokemon-type.entity';
import { Classification } from '../pokemons/entities/classification.entity';
import {
  Pokemon as PokemonData,
  PokemonTypeName,
} from './data/seed-pokemon.types';
import { Attack } from '../pokemons/entities/attack.entity';
import { Preconditions } from '../common/preconditions';
import { Evolution } from '../pokemons/entities/evolution.entity';
import { Candy } from '../pokemons/entities/candy.entity';

export class PokemonSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(`Seeding ${seedPokemonData.length} Pokemon...`);

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
    const candies = await em.find(Candy, {});
    const candiesMap = new Map(candies.map((candy) => [candy.name, candy]));
    const pokemonDataByPokedexId = new Map<number, PokemonData>(
      seedPokemonData.map((pokemon) => [Number(pokemon.id), pokemon]),
    );

    let createdCount = 0;
    for (const pokemon of seedPokemonData) {
      const types = pokemon.types.map((type) =>
        Preconditions.checkExists(
          typesMap.get(type),
          `Pokemon type ${type} not found`,
        ),
      );
      const resistant = pokemon.resistant.map((type) =>
        Preconditions.checkExists(
          typesMap.get(type),
          `Pokemon type ${type} not found`,
        ),
      );
      const weaknesses = pokemon.weaknesses.map((type) =>
        Preconditions.checkExists(
          typesMap.get(type),
          `Pokemon type ${type} not found`,
        ),
      );
      const fastAttacks = pokemon.attacks.fast.map((attack) =>
        Preconditions.checkExists(
          attacksMap.get(attack.name),
          `Attack ${attack.name} not found`,
        ),
      );
      const specialAttacks = pokemon.attacks.special.map((attack) =>
        Preconditions.checkExists(
          attacksMap.get(attack.name),
          `Attack ${attack.name} not found`,
        ),
      );
      const attacks = [...fastAttacks, ...specialAttacks];

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
        types: [...types],
        resistant,
        weaknesses,
        attacks,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      em.persist(pokemonData);
      createdCount++;
    }
    await em.flush();

    // create evolutions
    const pokemonEntities = await em.find(Pokemon, {});
    const pokemonEntityMap = new Map<number, Pokemon>(
      pokemonEntities.map((pokemon) => [pokemon.pokedexId, pokemon]),
    );

    for (const pokemon of seedPokemonData) {
      const currentPokemonEntity = Preconditions.checkExists(
        pokemonEntityMap.get(Number(pokemon.id)),
        `Pokemon ${pokemon.name} not found`,
      );

      // let's handle following evolutions
      if (pokemon.evolutions) {
        const directFollowingEvolutions = pokemon.evolutions.filter(
          (currentPokemonEvolution) => {
            const potentialDirectEvolutionPokemon = Preconditions.checkExists(
              pokemonDataByPokedexId.get(Number(currentPokemonEvolution.id)),
              `Pokemon ${currentPokemonEvolution.name} not found`,
            );

            const pokemonPreviousEvolutionsCount =
              pokemon['Previous evolution(s)']?.length || 0;
            const potentialDirectEvolutionPokemonPreviousEvolutionsCount =
              (potentialDirectEvolutionPokemon['Previous evolution(s)']
                ?.length || 1) - 1;

            return (
              pokemonPreviousEvolutionsCount ===
              potentialDirectEvolutionPokemonPreviousEvolutionsCount
            );
          },
        );

        const evolutionRequirements = Preconditions.checkExists(
          pokemon.evolutionRequirements,
          `Evolution requirements not found for ${pokemon.name}`,
        );

        const candyEntity = Preconditions.checkExists(
          candiesMap.get(evolutionRequirements.name),
          `Candy ${evolutionRequirements.name} not found`,
        );

        for (const directFollowingEvolution of directFollowingEvolutions) {
          const directFollowingEvolutionEntity = Preconditions.checkExists(
            pokemonEntityMap.get(Number(directFollowingEvolution.id)),
            `Direct following evolution ${directFollowingEvolution.name} not found`,
          );

          const evolution = em.create(Evolution, {
            fromPokemon: currentPokemonEntity,
            toPokemon: directFollowingEvolutionEntity,
            candy: candyEntity,
            candyAmount: evolutionRequirements.amount,
          });
          em.persist(evolution);
        }
        //em.persist(evo);
      }
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
