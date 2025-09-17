import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RotateTokenDto } from './dto/rotate-token.dto';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('rotate-token')
  @ApiOperation({
    summary: 'Rotate a token',
  })
  @ApiResponse({
    status: 200,
    description: 'The rotated token',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Token not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBody({
    type: RotateTokenDto,
    description: 'The token to rotate',
    required: true,
  })
  rotateToken(@Body() rotateTokenDto: RotateTokenDto) {
    return this.authService.rotateToken(rotateTokenDto);
  }
}
