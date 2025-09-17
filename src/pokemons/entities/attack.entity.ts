import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { PokemonType } from '../../pokemon-types/entities/pokemon-type.entity';
import { Pokemon } from './pokemon.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum AttackCategory {
  FAST = 'fast',
  SPECIAL = 'special',
}

@Entity()
export class Attack {
  @ApiProperty({ description: 'The ID of the attack', example: 1 })
  @PrimaryKey({ type: 'smallint' })
  id!: number;

  @ApiProperty({ description: 'The type of the attack' })
  @ManyToOne(() => PokemonType)
  type!: PokemonType;

  @ApiProperty({ description: 'The Pokemons that can use the attack' })
  @ManyToMany()
  pokemon = new Collection<Pokemon>(this);

  @ApiProperty({
    description: 'The name of the attack',
    example: 'Quick Attack',
  })
  @Property({ unique: true })
  name!: string;

  @ApiProperty({ description: 'The damage of the attack', example: 10 })
  @Property({ type: 'smallint', check: 'damage >= 0' })
  damage!: number;

  @ApiProperty({ description: 'The category of the attack', example: 'fast' })
  @Enum(() => AttackCategory)
  category!: AttackCategory;

  @ApiProperty({
    description: 'The date and time the attack was created',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ type: Date, defaultRaw: 'now()' })
  createdAt!: Date;

  @ApiProperty({
    description: 'The date and time the attack was updated',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ type: Date, defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
