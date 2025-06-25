import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateStoreIngredientDto {
  @ApiProperty({ description: 'The price of the ingredient' })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({ description: 'The title/name of the ingredient' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The unit of measurement for the ingredient', required: false })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ description: 'The quantity of the ingredient in stock' })
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ description: 'The store ID this ingredient belongs to', required: true })
  @IsNumber()
  store_id: number;
}
