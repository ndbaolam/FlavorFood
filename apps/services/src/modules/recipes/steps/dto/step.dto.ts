import { Type } from "class-transformer";
import { IsNumber, IsString, IsNotEmpty, IsOptional } from "class-validator";

export class StepDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  number?: number;

  @IsNotEmpty()  
  step: string;
}