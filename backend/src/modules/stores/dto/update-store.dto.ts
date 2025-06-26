import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './create-store.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

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
}
