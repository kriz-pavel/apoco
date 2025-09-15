// src/pokemon/dto/pokemon-list.query.dto.ts
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPokemonByIdDto {
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => Number(value))
  pokedexId: number;
}
