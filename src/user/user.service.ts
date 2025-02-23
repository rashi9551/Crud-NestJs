import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from 'src/utils/dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { EmailService } from 'src/utils/email/email.service';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,private readonly emailService: EmailService,) {}

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
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiry time (e.g., 10 minutes from now)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Create the new user, including the OTP and expiry
    const newUser = await this.userModel.create({
      ...userData,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    // Send the OTP via email (or SMS)
    await this.emailService.sendOtpEmail(newUser.email, otp);

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
