// src/pokemon/dto/pokemon-list.query.dto.ts
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetPokemonByIdDto {
  @ApiProperty({ description: 'The Pokedex ID of a Pokemon', example: '001' })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => Number(value))
  pokedexId: number;
}
