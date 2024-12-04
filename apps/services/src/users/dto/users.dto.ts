import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsStrongPassword } from 'class-validator';
import { UserRole } from '../entity/users.entity';

abstract class UserDto {
  @IsEmail()
  @IsNotEmpty()
  mail: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class CreateUserDto extends UserDto {
  
}

export class UpdateUserDto extends UserDto{
  
}

export class UserResponseDto {
  user_id: number;
  mail: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}