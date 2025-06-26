import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @ApiPropertyOptional({
    example: 5,
    description: 'Điểm đánh giá từ 1 đến 5 (tùy chọn)',
  })
  rating?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Cập nhật đánh giá: rất hài lòng',
    description: 'Bình luận đánh giá (tùy chọn)',
  })
  comment?: string;
}
