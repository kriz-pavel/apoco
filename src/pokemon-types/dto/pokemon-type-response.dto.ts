import { ApiProperty } from '@nestjs/swagger';

export class PokemonTypeResponseDto {
  @ApiProperty({
    type: String,
    description: 'The name of the Pokemon type',
    example: 'Electric',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'The slug of the Pokemon type',
    example: 'electric',
  })
  slug: string;
}
