import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,    private readonly jwtService: JwtService,
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
}
