// src/pokemon/dto/pokemon-list.query.dto.ts
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
import { convertTextToSlug } from 'src/common/conversions/conversions';

export enum PokemonSortBy {
  id = 'id',
  name = 'name',
}

export enum PokemonSortDir {
  asc = 'asc',
  desc = 'desc',
}

export class FilterPokemonQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 20;

  @ApiPropertyOptional({ enum: PokemonSortBy, default: PokemonSortBy.id })
  @IsEnum(PokemonSortBy)
  sortBy: PokemonSortBy = PokemonSortBy.id;

  @ApiPropertyOptional({ enum: PokemonSortDir, default: PokemonSortDir.asc })
  sortDir: PokemonSortDir = PokemonSortDir.asc;

  @ApiPropertyOptional({ description: 'fulltext search by name (ILIKE %q%)' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'type of pokemon; comma-separated: fire,water',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => convertTextToSlug(value))
  type?: string;

  @ApiPropertyOptional({ description: 'favorite pokemon' })
  @IsOptional()
  @IsBoolean()
  favorites?: boolean;
}
