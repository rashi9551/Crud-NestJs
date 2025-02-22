import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUser(id: string): Promise<UserDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    let user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return await this.userModel.find();
  }

  async createUser(userData: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await this.userModel.create({
      ...userData,
      password: hashedPassword,
    });

    return newUser;
  }

  async updateUser(
    id: string,
    updateUserData: UpdateUserDto,
  ): Promise<UserDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    let user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, updateUserData);
    return user.save();
  }

  async removeUser(id: string): Promise<{ message: string }> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const result = await this.userModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { message: `User with ID ${id} deleted successfully` };
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
