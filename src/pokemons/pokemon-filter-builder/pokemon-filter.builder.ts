import { Injectable } from '@nestjs/common';
import { FilterPokemonQueryDto } from './dto/filter-pokemon-query.dto';

export type FilterPokemonQueryObject = ReturnType<
  typeof PokemonFilterBuilder.prototype.buildPokemonFilterQueryObject
>;

@Injectable()
export class PokemonFilterBuilder {
  buildPokemonFilterQueryObject({ filter }: { filter: FilterPokemonQueryDto }) {
    const { page, limit, sortBy, sortDir, type, q } = filter;
    return {
      where: {
        ...(q ? { name: { $ilike: `%${q}%` } } : {}),
        ...(type ? { types: { slug: type } } : {}),
      },
      options: {
        offset: (page - 1) * limit,
        limit,
        orderBy: { [sortBy]: sortDir },
      },
    };
  }
}
