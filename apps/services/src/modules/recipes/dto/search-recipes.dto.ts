import { IsOptional, IsString, IsInt, Min, IsEnum, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DifficultyLevel, Lang } from '../entity/recipes.entity';

export class SearchRecipeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  description?: DifficultyLevel;

  @IsOptional()
  @IsString()
  difficulty_level?: string;  
  
  @IsOptional()
  @IsEnum(Lang)
  lang?: Lang;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;  

  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => {    
      return Array.isArray(value) ? value : [value];
    })  
  categories: string[];
}
