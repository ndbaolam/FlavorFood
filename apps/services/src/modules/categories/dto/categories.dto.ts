import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoriesDto {
  @ApiProperty({
    example: 'Vietnamese Cuisine',
    description: 'The name of the category',
  })
  @IsNotEmpty({ message: 'Title is required.' })
  @IsString({ message: 'Title must be a string.' })
  title: string;
}

export class UpdateCategoriesDto {
  @ApiPropertyOptional({
    example: 'Italian Cuisine',
    description: 'The updated name of the category (optional)',
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  title?: string;
}
