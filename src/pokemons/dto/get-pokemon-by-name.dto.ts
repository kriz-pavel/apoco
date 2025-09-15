// src/pokemon/dto/pokemon-list.query.dto.ts
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPokemonByNameDto {
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  name: string;
}
