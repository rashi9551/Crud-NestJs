// user.dto.ts
import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';
import { UserRole } from 'src/enum/user.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole, {
    message: 'Role must be one of Manager, Accountant, User, or Sales',
  })
  roles: UserRole;
}
