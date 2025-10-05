import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PokedexIdDto {
  @ApiProperty({
    type: String,
    description: 'The Pokedex ID of a Pokemon',
    example: '001',
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => Number(value))
  @IsInt({ message: 'Pokedex ID must be an integer' })
  @Min(1, { message: 'Pokedex ID must be greater than 0' })
  pokedexId: number;
}
