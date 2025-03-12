import { IsNumber, IsString, IsNotEmpty } from "class-validator";

export class StepDto {
  @IsNotEmpty()
  @IsNumber()
  number: number;

  @IsNotEmpty()  
  step: string;
}