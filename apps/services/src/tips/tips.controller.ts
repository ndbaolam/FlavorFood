import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, HttpCode } from '@nestjs/common';
import { TipsService } from './tips.service';
import { CreateTipDto, UpdateTipDto } from './dto/tips.dto';

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
  search(@Query('title') title: string) {
    return this.tipsService.searchByTitle(title);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipsService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTipDto: UpdateTipDto) {
    return this.tipsService.update(Number(id), updateTipDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipsService.remove(Number(id));
  }
}
