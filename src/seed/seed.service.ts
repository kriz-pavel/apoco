import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Pokemon } from '../pokemon/pokemon.entity';
import { SeedPokemonData } from './data/seed_pokemon.types';

@Injectable()
export class SeedService {
  constructor(private readonly em: EntityManager) {}

  async run() {
    const file = path.join(__dirname, 'data', 'seed_pokemon.json');
    const raw = JSON.parse(fs.readFileSync(file, 'utf-8')) as SeedPokemonData;

    const names = raw['pokemons'].map((p) => p.name);

    const em = this.em.fork();

    for (const name of names) {
      const exists = await em.findOne(Pokemon, { name });
      if (!exists) em.persist(em.create(Pokemon, { name }));
    }
    await em.flush();
  }
}
