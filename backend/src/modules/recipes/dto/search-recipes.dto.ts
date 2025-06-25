import { IsOptional, IsString, IsInt, Min, IsEnum, IsArray, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DifficultyLevel } from '../entity/recipes.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchRecipeDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '', description: 'Search by title' })
  title?: string;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  @ApiPropertyOptional({ enum: DifficultyLevel, example: DifficultyLevel.EASY, description: 'Filter by difficulty' })
  difficulty_level?: DifficultyLevel;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '', description: 'Search by description' })
  description?: string;  

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 0, description: 'Offset for pagination' })
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 10, description: 'Limit for pagination' })
  limit?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiPropertyOptional({ example: true, description: 'Filter by most popular' })
  feature?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiPropertyOptional({ example: true, description: 'Filter by most rating' })
  most_rating?: boolean;

  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  @ApiPropertyOptional({ type: [String], example: [], description: 'Category filter as array of strings' })
  categories: string[];
}
