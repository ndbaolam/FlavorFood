import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGenreDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Healthy', description: 'Tên thể loại mẹo (genre)' })
  title: string;
}

export class UpdateGenreDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Fitness',
    description: 'Tên thể loại mẹo được cập nhật',
  })
  title?: string;
}
