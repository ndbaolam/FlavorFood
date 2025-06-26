import { Type } from 'class-transformer';
import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StepDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 1, description: 'Thứ tự của bước hướng dẫn' })
  number?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Trộn đều tất cả nguyên liệu lại với nhau.',
    description: 'Mô tả bước hướng dẫn',
  })
  step: string;
}
