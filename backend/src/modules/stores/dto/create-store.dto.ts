import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    required: false,
    enum: ['active', 'inactive', 'closed'],
    default: 'active',
  })
  @IsOptional()
  @IsString()
  status?: 'active' | 'inactive' | 'closed' = 'active';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  openHours?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  closeHours?: Date;
}
