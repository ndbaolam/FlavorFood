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

  @ApiProperty({ required: true })  
  @IsString()
  location: string;

  @ApiProperty({ required: true })
  @IsString()
  phone_number?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
