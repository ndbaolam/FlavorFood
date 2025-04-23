import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Categories } from './entity/categories.entity';
import {
  CreateCategoriesDto,
  UpdateCategoriesDto,
} from './dto/categories.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoriesDto })
  @ApiResponse({ status: 201, description: 'Category created', type: Categories })
  async create(
    @Body() createCategoriesDto: CreateCategoriesDto
  ): Promise<Categories> {
    return this.categoriesService.create(createCategoriesDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories or search by title' })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of categories', type: [Categories] })
  async findAll(
    @Query('title') title: string
  ): Promise<Categories[]> {
    if (title === null || title === undefined)
      return this.categoriesService.findAll();
    else return this.categoriesService.findByTitle(title);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Category details', type: Categories })
  async findOne(@Param('id') id: string): Promise<Categories> {
    return this.categoriesService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCategoriesDto })
  @ApiResponse({ status: 200, description: 'Category updated', type: Categories })
  async update(
    @Param('id') id: string,
    @Body() updateCategoriesDto: UpdateCategoriesDto
  ): Promise<Categories> {
    return this.categoriesService.update(Number(id), updateCategoriesDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(Number(id));
  }
}
