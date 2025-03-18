import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  ParseArrayPipe,
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { CreateTipDto, UpdateTipDto } from './dto/tips.dto';

@Controller('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Post('create')
  create(
    @Body(
      'genres', new ParseArrayPipe({items: Number, separator: ","})
    ) genresId: number[],
    @Body() { genres, ...tipData }: CreateTipDto
  ) {
    const createTipDto = {
      ...tipData,
      genres: genresId
    }

    return this.tipsService.create(createTipDto);
  }

  @Get('all')
  findAll() {
    return this.tipsService.findAll();
  }

  @Get('search')
  async search(
    @Query('title') title?: string,
    @Query('genres', ParseArrayPipe) genreIds?: number[],
    @Query('offset', ParseIntPipe) offset?: number, 
    @Query('limit', ParseIntPipe) limit?: number,
  ) {    
    return this.tipsService.search(title, genreIds, offset, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(
      'genres', new ParseArrayPipe({items: Number, separator: ","})
    ) genresId: number[],
    @Body() { genres, ...tipData }: UpdateTipDto
  ) {
    const updateTipDto = {
      ...tipData,
      genres: genresId
    }

    return this.tipsService.update(Number(id), updateTipDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipsService.remove(Number(id));
  }
}
