import { ApiProperty } from '@nestjs/swagger';

export class RotateTokenResponseDto {
  @ApiProperty({
    type: String,
    description: 'The rotated token',
    example: '8cff4a54cca5a11096573997e867307e9ec84d413a0259a041886529e5dd778c',
  })
  token: string;
}
