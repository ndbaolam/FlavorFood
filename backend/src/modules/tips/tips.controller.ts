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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('tips')
@ApiTags('Tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new tip' })
  @ApiBody({ type: CreateTipDto })
  @ApiResponse({
    status: 201,
    description: 'The tip has been successfully created.',
  })
  create(
    @Body('genres', new ParseArrayPipe({ items: Number, separator: ',' }))
    genresId: number[],
    @Body() { genres, ...tipData }: CreateTipDto,
  ) {
    const createTipDto = {
      ...tipData,
      genres: genresId,
    };

    return this.tipsService.create(createTipDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all tips' })
  @ApiResponse({ status: 200, description: 'Return all tips.' })
  findAll() {
    return this.tipsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search tips by title and genres' })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({
    name: 'genres',
    required: false,
    type: [Number],
    style: 'form',
    explode: false,
  })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Filtered tips returned.' })
  async search(
    @Query('title') title?: string,
    @Query('genres', ParseArrayPipe) genreIds?: number[],
    @Query('offset', ParseIntPipe) offset?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    return this.tipsService.search(title, genreIds, offset, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tip by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tip found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipsService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tip' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTipDto })
  @ApiResponse({ status: 200, description: 'Tip updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('genres', new ParseArrayPipe({ items: Number, separator: ',' }))
    genresId: number[],
    @Body() { genres, ...tipData }: UpdateTipDto,
  ) {
    const updateTipDto = {
      ...tipData,
      genres: genresId,
    };

    return this.tipsService.update(Number(id), updateTipDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a tip' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Tip deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipsService.remove(Number(id));
  }
}
