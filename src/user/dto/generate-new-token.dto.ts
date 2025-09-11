import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateNewTokenDto {
  @IsString()
  @IsNotEmpty()
  readonly token: string;
}
