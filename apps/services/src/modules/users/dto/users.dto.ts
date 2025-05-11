import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsStrongPassword, IsDate } from 'class-validator';
import { UserRole } from '../entity/users.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  mail: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty({ example: 'Abcdefgh1.' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John' })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Doe' })
  last_name: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UpdateUserDto {
  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}