import { Type } from 'class-transformer';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NutritionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Protein',
    description: 'Name of the nutrition element',
  })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 25, description: 'Amount of the nutrition element' })
  amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'grams',
    description: 'Unit of the nutrition element (e.g., grams, mg)',
  })
  unit: string;
}
