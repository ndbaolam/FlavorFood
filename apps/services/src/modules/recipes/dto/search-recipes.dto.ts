import { IsOptional, IsString, IsInt, Min, IsEnum, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DifficultyLevel, Lang } from '../entity/recipes.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchRecipeDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Pizza', description: 'Search by title' })
  title?: string;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  @ApiPropertyOptional({ enum: DifficultyLevel, example: DifficultyLevel.EASY, description: 'Filter by difficulty' })
  description?: DifficultyLevel;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'medium', description: 'Search by difficulty as a string (alternative)' })
  difficulty_level?: string;

  @IsOptional()
  @IsEnum(Lang)
  @ApiPropertyOptional({ enum: Lang, example: Lang.ENG, description: 'Filter by language' })
  lang?: Lang;

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
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  @ApiPropertyOptional({ type: [String], example: ['1', '2'], description: 'Category filter as array of strings' })
  categories: string[];
}
