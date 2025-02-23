// user.dto.ts
import {
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { UserRole } from 'src/utils/enum/user.enum';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole, { message: 'Role must be ADMIN, PO, BO, or TO' })
  roles: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class AuthUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
