import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
} from 'class-validator';
import { DifficultyLevel } from '../entity/recipes.entity';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { IngredientDto } from '../ingredient/dto/ingredient.dto';
import { NutritionDto } from '../nutrition/dto/nutrition.dto';
import { StepDto } from '../steps/dto/step.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Pizza Margherita' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Delicious Italian pizza with tomato and cheese.' })
  description: string;

  @IsEnum(DifficultyLevel)
  @ApiProperty({ enum: DifficultyLevel, example: DifficultyLevel.EASY })
  difficulty_level: DifficultyLevel;  

  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 30, description: 'Time in minutes' })
  time?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  image?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'https://example.com/image-detail.jpg' })
  image_detail?: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 2, description: 'Number of servings' })
  serving: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 4.5 })
  rating?: number;

  @IsOptional()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  @Type(() => Number)
  @ApiPropertyOptional({ type: [Number], example: [1, 2] })
  categories?: number[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  @Type(() => IngredientDto)
  @ApiPropertyOptional({ type: [IngredientDto] })
  ingredients?: IngredientDto[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  @Type(() => NutritionDto)
  @ApiPropertyOptional({ type: [NutritionDto] })
  nutrition?: NutritionDto[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  @Type(() => StepDto)
  @ApiPropertyOptional({ type: [StepDto] })
  steps?: StepDto[];
}

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Updated title' })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Updated description' })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Updated step (deprecated)' })
  step?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 2, description: 'Number of servings' })
  serving?: number;

  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 30, description: 'Time in minutes' })
  time?: number;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  @ApiPropertyOptional({ enum: DifficultyLevel, example: DifficultyLevel.MEDIUM })
  difficulty_level?: DifficultyLevel;

  @IsOptional()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  @Type(() => Number)
  @ApiPropertyOptional({ type: [Number], example: [3, 4] })
  categories?: number[];
}
