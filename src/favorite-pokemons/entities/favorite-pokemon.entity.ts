import { Entity, PrimaryKey, ManyToOne, Unique } from '@mikro-orm/core';
import { Pokemon } from '../../pokemons/entities/pokemon.entity';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique({ properties: ['user', 'pokemon'] })
export class FavoritePokemon {
  @ApiProperty({ description: 'The ID of the record', example: 1 })
  @PrimaryKey()
  id!: number;

  @ApiProperty({ description: 'The favorite Pokemon' })
  @ManyToOne(() => Pokemon, { deleteRule: 'cascade', index: true })
  pokemon!: Pokemon;

  @ApiProperty({ description: 'The user who favorited the Pokemon' })
  @ManyToOne(() => User, { deleteRule: 'cascade', index: true })
  user!: User;
}
