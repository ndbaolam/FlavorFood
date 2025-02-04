import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DifficultyLevel } from '../entity/recipes.entity';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(DifficultyLevel)
  difficulty_level: DifficultyLevel;

  @IsOptional()
  time?: Date;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  image_detail?: string;

  @IsNumber()
  @Type(() => Number)
  serving: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rating?: number;

  @IsNotEmpty()
  @IsString()
  step: string;

  @IsNotEmpty()
  @IsString()
  nutrition: string;

  @IsOptional()
  @IsArray({ message: 'Categories must be an array of numbers.' })
  @ArrayNotEmpty({ message: 'Categories array cannot be empty if provided.' })
  @ArrayUnique({ message: 'Duplicate category IDs are not allowed.' })
  @IsInt({ each: true, message: 'Each category ID must be an integer.' })
  @Type(() => Number)
  categories?: number[];
}

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  step?: string;

  @IsOptional()
  @IsString()
  nutrition?: string;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty_level?: DifficultyLevel;

  @IsOptional()
  @Transform(({ value }) => {    
    return Array.isArray(value) ? value : [value];
  })
  @IsArray({ message: 'Categories must be an array of numbers.' })
  @ArrayUnique({ message: 'Duplicate category IDs are not allowed.' })
  @IsInt({ each: true, message: 'Each category ID must be an integer.' })
  @Type(() => Number)
  categories?: number[];
}
