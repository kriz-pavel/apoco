import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    type: Number,
    description: 'The ID of the user',
    example: '1',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;
}

export class UserResponseDto {
  user: UserDto;

  @ApiProperty({
    type: String,
    description: 'The token of the user',
    example: '8cff4a54cca5a11096573997e867307e9ec84d413a0259a041886529e5dd778c',
  })
  token: string;
}
