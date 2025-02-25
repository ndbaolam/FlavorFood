import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGenreDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}

export class UpdateGenreDto {
  @IsOptional()
  @IsString()
  title?: string;
}