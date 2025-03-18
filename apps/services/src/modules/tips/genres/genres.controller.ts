import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { GenresService } from './genres.service';
import { TipGenres } from './entity/genres.entity';
import { CreateGenreDto, UpdateGenreDto } from './dto/genres.dto';

@Controller('tip-genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get('all')
  findAll(): Promise<TipGenres[]> {
    return this.genresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TipGenres> {
    return this.genresService.findOne(Number(id));
  }

  @Post('create')
  create(@Body() createGenreDto: CreateGenreDto): Promise<TipGenres> {
    return this.genresService.create(createGenreDto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGenreDto: UpdateGenreDto): Promise<TipGenres> {
    return this.genresService.update(Number(id), updateGenreDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.genresService.delete(Number(id));
  }
}
