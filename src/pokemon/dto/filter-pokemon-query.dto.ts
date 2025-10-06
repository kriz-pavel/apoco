import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  Min,
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { convertTextToSlug } from '../../common/conversions/conversions';

export enum PokemonSortBy {
  pokedexId = 'pokedexId',
  name = 'name',
}

export enum PokemonSortDir {
  asc = 'asc',
  desc = 'desc',
}

export class FilterPokemonQueryDto {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ type: Number, default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 20;

  @ApiPropertyOptional({
    enum: PokemonSortBy,
    default: PokemonSortBy.pokedexId,
  })
  @IsEnum(PokemonSortBy)
  sortBy: PokemonSortBy = PokemonSortBy.pokedexId;

  @ApiPropertyOptional({ enum: PokemonSortDir, default: PokemonSortDir.asc })
  @IsEnum(PokemonSortDir)
  sortDir: PokemonSortDir = PokemonSortDir.asc;

  @ApiPropertyOptional({ description: 'fulltext search by name (ILIKE %q%)' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'types of pokemon (e.g. Fire, Water)',
    type: String,
    isArray: true,
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }: { value: string }) => {
    return Array.isArray(value)
      ? value.map((t: string) => convertTextToSlug(t.trim()))
      : [convertTextToSlug(value.trim())];
  })
  types?: string[];

  @ApiPropertyOptional({ description: 'favorite pokemon' })
  @IsOptional()
  @Transform(
    ({ value, obj, key }) => {
      const rawValue = (obj as unknown)?.[key] as unknown;

      if (typeof rawValue === 'boolean') {
        return rawValue;
      }
      if (typeof rawValue === 'string') {
        const v = rawValue.trim().toLowerCase();
        if (['true', '1', 'yes'].includes(v)) {
          return true;
        }
        if (['false', '0', 'no'].includes(v)) {
          return false;
        }
        return undefined;
      }
      if (typeof value === 'boolean') {
        return value;
      }
      return undefined;
    },
    { toClassOnly: true },
  )
  @IsBoolean()
  favorites?: boolean;
}
