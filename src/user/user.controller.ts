import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { UserDocument } from './schemas/user.schema';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: string): Promise<UserDocument> {
    return this.userService.getUser(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllUsers(): Promise<UserDocument[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createUser(
    @Body(new ValidationPipe({ whitelist: true })) userData: CreateUserDto,
  ): Promise<UserDocument> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    updateUserData: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userService.updateUser(id, updateUserData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeUser(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }
}
