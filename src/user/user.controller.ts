import {
  Body,
  Controller,
  Delete,
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
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    updateUserData: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userService.updateUser(id, updateUserData);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserDocument> {
    return this.userService.getUser(id);
  }

  @Get()
  getAllUser(): Promise<UserDocument[]> {
    return this.userService.getAllUser();
  }
}
