import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IngredientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Sugar', description: 'Name of the ingredient' })
  ingredient: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 100, description: 'Quantity of the ingredient' })
  quantity: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'grams',
    description: 'Unit of the ingredient (e.g., grams, ml, tbsp)',
  })
  unit: string;
}
