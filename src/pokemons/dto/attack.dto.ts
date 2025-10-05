import { ApiProperty } from '@nestjs/swagger';
import { AttackCategory } from '../entities/attack.entity';
import { PokemonTypeDto } from './pokemon-type.dto';

export class AttackDto {
  @ApiProperty({
    type: String,
    description: 'The name of the attack',
    example: 'Thunderbolt',
  })
  name: string;

  @ApiProperty({
    type: PokemonTypeDto,
    description: 'The type of the attack',
    example: { name: 'Electric', slug: 'electric' },
  })
  type: PokemonTypeDto;

  @ApiProperty({
    type: Number,
    description: 'The damage of the attack',
    example: 90,
  })
  damage: number;

  @ApiProperty({
    enum: AttackCategory,
    description: 'The category of the attack',
    example: 'fast',
  })
  category: AttackCategory;
}
