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
  ValidateNested,
} from 'class-validator';
import { DifficultyLevel } from '../entity/recipes.entity';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { IngredientDto } from '../../ingredient/dto/ingredient.dto';
import { Nutritrion } from '../../nutrition/entity/nutrition.entity';
import { Steps } from '../../steps/entity/step.entity';
import { NutritionDto } from '../../nutrition/dto/nutrition.dto';
import { StepDto } from '../../steps/dto/step.dto';

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
  time?: number;

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

  @IsOptional()  
  @Transform(({ value }) => {    
    return Array.isArray(value) ? value : [value];
  })
  @Type(() => Number)
  categories?: number[];

  @IsOptional()
  @IsArray()  
  @Transform(({ value }) => {    
    return Array.isArray(value) ? value : [value];
  })
  @Type(() => IngredientDto)
  ingredients?: IngredientDto[];

  @IsOptional()
  @IsArray()  
  @Transform(({ value }) => {    
    return Array.isArray(value) ? value : [value];
  })
  @Type(() => NutritionDto)
  nutrition?: NutritionDto[];

  @IsOptional()
  @IsArray()  
  @Transform(({ value }) => {    
    return Array.isArray(value) ? value : [value];
  })
  @Type(() => StepDto)
  steps?: StepDto[];
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
  @IsEnum(DifficultyLevel)
  difficulty_level?: DifficultyLevel;

  @IsOptional()
  @Transform(({ value }) => {    
    return Array.isArray(value) ? value : [value];
  })  
  @Type(() => Number)
  categories?: number[];
}
