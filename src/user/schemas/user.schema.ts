import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from 'src/utils/enum/user.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({
    required: true,
    enum: UserRole,
  })
  roles: string;

  @Prop()
  otp: string;

  @Prop()
  otpExpiry: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
