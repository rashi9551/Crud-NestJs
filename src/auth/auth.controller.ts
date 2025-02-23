import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthUserDto } from 'src/utils/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body(new ValidationPipe({ whitelist: true })) authData: AuthUserDto) {
    return this.authService.login(authData.email, authData.password);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() body: { otp: string; email: string },
  ): Promise<{ message: string }> {
    return this.authService.verifyOtp(body);
  }
}
