import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dto/user.dto';
import { UserDocument } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body(new ValidationPipe({ whitelist: true })) userData: CreateUserDto):Promise<UserDocument> {
    return this.userService.createUser(userData);
  }
}
