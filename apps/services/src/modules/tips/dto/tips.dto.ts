import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsArray, ArrayNotEmpty, ArrayUnique, IsInt, ValidateNested } from 'class-validator';

export class CreateTipDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()  
  @IsInt({ each: true, message: 'Each category ID must be an integer.' })
  @Type(() => Number)   
  genres?: number[];
}

export class UpdateTipDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()  
  @IsInt({ each: true, message: 'Each category ID must be an integer.' })  
  @Type(() => Number) 
  genres?: number[];
}
