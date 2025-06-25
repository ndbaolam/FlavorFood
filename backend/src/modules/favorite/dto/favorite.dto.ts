import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({
    example: 1,
    description: 'ID của người dùng đánh dấu công thức yêu thích',
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  user_id: number;

  @ApiProperty({
    example: 10,
    description: 'ID của công thức được đánh dấu yêu thích',
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  recipe_id: number;
}
