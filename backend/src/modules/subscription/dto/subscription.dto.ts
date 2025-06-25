import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @ApiProperty({ example: 200000 })
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 30, description: 'Number of days for the subscription' })
  @Type(() => Number)
  day_remain: number;
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
  @ApiProperty({ example: 200000, required: false })
  @Type(() => Number)
  price?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 30, description: 'Number of days for the subscription', required: false })
  @Type(() => Number)
  day_remain?: number;
}