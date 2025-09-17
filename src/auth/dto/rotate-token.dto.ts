import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RotateTokenDto {
  @ApiProperty({ description: 'The token to rotate' })
  @IsString()
  @IsNotEmpty()
  readonly token: string;
}
