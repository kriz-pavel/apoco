import { Entity, PrimaryKey, ManyToOne, Unique } from '@mikro-orm/core';
import { Pokemon } from '../../pokemons/entities/pokemon.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@Unique({ properties: ['user', 'pokemon'] })
export class FavoritePokemon {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Pokemon, { deleteRule: 'cascade', index: true })
  pokemon!: Pokemon;

  @ManyToOne(() => User, { deleteRule: 'cascade', index: true })
  user!: User;
}
