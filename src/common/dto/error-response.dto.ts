import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ type: Number })
  statusCode: number;

  @ApiProperty({ type: String, example: 'Error' })
  error: string;

  @ApiProperty({
    type: [String],
    example: ['Error message'],
  })
  message: string[];

  @ApiProperty({
    type: String,
    example: '/api/pokemon?favorites=true',
    nullable: true,
  })
  path: string | null;

  @ApiProperty({
    type: String,
    example: '2021-01-01T00:00:00.000Z',
    nullable: true,
  })
  timestamp: string | null;
}
