import { IsNotEmpty, IsString } from 'class-validator';

export class RotateTokenDto {
  @IsString()
  @IsNotEmpty()
  readonly token: string;
}
