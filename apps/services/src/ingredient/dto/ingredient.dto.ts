import { Type } from "class-transformer";
import { IsOptional, IsNumber, IsString } from "class-validator";

export class IngredientDto {
  @IsOptional()
  @IsString()
  ingredient?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;
}