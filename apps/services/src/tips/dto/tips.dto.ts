import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTipDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UpdateTipDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
