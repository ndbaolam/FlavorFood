import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ example: 1, description: 'ID người dùng gửi đánh giá' })
  userId: number;

  @IsInt()
  @Type(() => Number)
  @ApiProperty({ example: 10, description: 'ID công thức được đánh giá' })
  recipeId: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  @ApiProperty({ example: 4, description: 'Điểm đánh giá từ 1 đến 5' })
  rating: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Món ăn rất ngon!', description: 'Nhận xét thêm về công thức (nếu có)' })
  comment?: string;
}
