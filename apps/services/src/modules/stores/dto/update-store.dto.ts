import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './create-store.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;
}
