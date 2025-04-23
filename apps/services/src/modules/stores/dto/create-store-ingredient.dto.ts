import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateStoreIngredientDto {
  @ApiProperty({ description: 'The price of the ingredient' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'The unit of measurement for the ingredient' })
  @IsString()
  unit: string;

  @ApiProperty({ description: 'The title/name of the ingredient' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The quantity of the ingredient in stock' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'The store ID this ingredient belongs to', required: false })
  @IsUUID()
  @IsOptional()
  store_id?: string;
}
