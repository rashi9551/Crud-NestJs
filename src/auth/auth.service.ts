import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, plainPassword: string) {
    const user = await this.userService.getUserByEmail(email);
    const passwordValid = await bcrypt.compare(plainPassword, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { sub: user._id, email: user.email };

    // Sign the payload and return the JWT token
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async verifyOtp({otp,email}):Promise<{message:string}>{
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    if(otp===user.otp)return {message:"user verified succesfully"}
    else return {message:"user not verified"}
  }
}
