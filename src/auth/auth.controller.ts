import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RotateTokenDto } from './dto/rotate-token.dto';
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { RotateTokenResponseDto } from './dto/rotate-token-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('rotate-token')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Rotate a token',
  })
  @ApiOkResponse({
    type: RotateTokenResponseDto,
    example: {
      token: '8cff4a54cca5a11096573997e867307e9ec84d413a0259a041886529e5dd778c',
    },
    description: 'The rotated token',
  })
  @ApiBadRequestResponse({
    description: 'Invalid token',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Token not found',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
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
