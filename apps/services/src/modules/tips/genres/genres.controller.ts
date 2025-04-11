import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { TipGenres } from './entity/genres.entity';
import { CreateGenreDto, UpdateGenreDto } from './dto/genres.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Tip Genres') // Hiển thị nhóm ở Swagger UI
@Controller('tip-genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get('all')
  @ApiOkResponse({ description: 'List all genres', type: [TipGenres] })
  findAll(): Promise<TipGenres[]> {
    return this.genresService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get genre by ID', type: TipGenres })
  @ApiNotFoundResponse({ description: 'Genre not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TipGenres> {
    return this.genresService.findOne(id);
  }

  @Post('create')
  @ApiCreatedResponse({ description: 'Genre created', type: TipGenres })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() createGenreDto: CreateGenreDto): Promise<TipGenres> {
    return this.genresService.create(createGenreDto);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Genre updated', type: TipGenres })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiNotFoundResponse({ description: 'Genre not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<TipGenres> {
    return this.genresService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Genre deleted' })
  @ApiNotFoundResponse({ description: 'Genre not found' })
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.genresService.delete(id);
  }
}
