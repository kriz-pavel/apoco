import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { FavoritePokemon } from '../../favorite-pokemons/entities/favorite-pokemon.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @ApiProperty({ description: 'The ID of the user', example: 1 })
  @PrimaryKey()
  id!: number;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
  })
  @Property({ unique: true })
  email!: string;

  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  @Property()
  name!: string;

  @ApiProperty({ description: 'The favorite Pokemons of the user' })
  @OneToMany(() => FavoritePokemon, (fav) => fav.user)
  favorites = new Collection<FavoritePokemon>(this);

  @ApiProperty({
    description: 'The date and time the user was created',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ type: Date, defaultRaw: 'now()' })
  createdAt!: Date;

  @ApiProperty({
    description: 'The date and time the user was updated',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ type: Date, defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
