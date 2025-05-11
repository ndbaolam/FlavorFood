import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Premium Plan' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Access to premium features', required: false })
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 19.99 })
  price: number;
}
export class UpdateSubscriptionDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Premium Plan' })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Access to premium features', required: false })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 19.99, required: false })
  price?: number;
}