import { Type } from "class-transformer";
import { IsNumber, IsString, IsNotEmpty } from "class-validator";

export class NutritionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsNotEmpty()
  @IsString()
  unit: string;
}