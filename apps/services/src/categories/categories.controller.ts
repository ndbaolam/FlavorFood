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
import { CreateCategoriesDto, UpdateCategoriesDto } from './dto/categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoriesDto: CreateCategoriesDto
  ): Promise<Categories> {
    return this.categoriesService.create(createCategoriesDto);
  }

  @Get()
  async findAll(
    @Query('title') title: string
  ): Promise<Categories[]> {
    if(title === null)
      return this.categoriesService.findAll();
    else 
      return this.categoriesService.findByTitle(title);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Categories> {
    return this.categoriesService.findOne(Number(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoriesDto: UpdateCategoriesDto
  ): Promise<Categories> {
    return this.categoriesService.update(Number(id), updateCategoriesDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(Number(id));
  }
}
