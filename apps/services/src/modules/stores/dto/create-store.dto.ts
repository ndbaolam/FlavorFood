import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string; 

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone_number?: string; 

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  openHours: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  closeHours: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
