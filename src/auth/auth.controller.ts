import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthUserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body(new ValidationPipe({ whitelist: true })) authData: AuthUserDto) {
    return this.authService.login(authData.email, authData.password);
  }
}
