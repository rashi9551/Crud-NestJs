import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { UserDocument } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(
    @Body(new ValidationPipe({ whitelist: true })) userData: CreateUserDto,
  ): Promise<UserDocument> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  updateUser(
    @Param('id', new ValidationPipe({ whitelist: true })) id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    updateUserData: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userService.updateUser(id, updateUserData);
  }
}
