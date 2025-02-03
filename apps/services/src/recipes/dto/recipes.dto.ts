import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { DifficultyLevel } from '../entity/recipes.entity';
import { Type } from 'class-transformer';

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
}

export class UpdateRecipeDto extends CreateRecipeDto {}
