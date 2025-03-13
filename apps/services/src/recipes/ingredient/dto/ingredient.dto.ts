import { Type } from "class-transformer";
import { IsOptional, IsNumber, IsString, IsNotEmpty } from "class-validator";

export class IngredientDto {
  @IsNotEmpty()
  @IsString()
  ingredient?: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsNotEmpty()
  @IsString()
  unit?: string;
}