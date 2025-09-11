import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RotateTokenDto } from './dto/rotate-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('rotate-token')
  create(@Body() rotateTokenDto: RotateTokenDto) {
    return this.authService.rotateToken(rotateTokenDto);
  }
}
