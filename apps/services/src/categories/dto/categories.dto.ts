import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoriesDto {
  @IsNotEmpty({ message: 'Title is required.' })
  @IsString({ message: 'Title must be a string.' })
  title: string;
}

export class UpdateCategoriesDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  title?: string;
}