import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetPokemonByNameDto {
  @ApiProperty({
    type: String,
    description: 'The name of the Pokemon',
    example: 'Pikachu',
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  name: string;
}
