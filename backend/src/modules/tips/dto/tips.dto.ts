import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateTipDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Tip', description: 'Tiêu đề mẹo' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Đường dẫn ảnh thumbnail' })
  thumbnail: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Content', description: 'Nội dung mẹo' })
  content: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'Each genre ID must be an integer.' })
  @Type(() => Number)
  @ApiPropertyOptional({ example: [1, 2], description: 'Danh sách ID thể loại mẹo (genres)' })
  genres?: number[];
}

export class UpdateTipDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Updated Title', description: 'Tiêu đề mới' })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'https://example.com/new-thumbnail.jpg', description: 'Thumbnail mới' })
  thumbnail?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Updated Content', description: 'Nội dung mới' })
  content?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'Each genre ID must be an integer.' })
  @Type(() => Number)
  @ApiPropertyOptional({ example: [1, 3], description: 'Danh sách ID thể loại mẹo cập nhật' })
  genres?: number[];
}
