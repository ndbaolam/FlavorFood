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
import { IntegerType } from 'typeorm';

@Controller('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Post('create')
  create(@Body() createTipDto: CreateTipDto) {
    return this.tipsService.create(createTipDto);
  }

  @Get('all')
  findAll() {
    return this.tipsService.findAll();
  }

  @Get('search')
  async search(
    @Query('title') title?: string,
    @Query('genres', ParseArrayPipe) genreIds?: number[]
  ) {    
    return this.tipsService.search(title, genreIds);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTipDto: UpdateTipDto
  ) {
    return this.tipsService.update(Number(id), updateTipDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipsService.remove(Number(id));
  }
}
