import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  BadRequestException,
  Patch,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipes.dto';
import { Recipes } from './entity/recipes.entity';
import { SearchRecipeDto } from './dto/search-recipes.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}  

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Recipes> {
    try {
      return this.recipesService.findOne(Number(id));
    } catch (error) {
      throw new BadRequestException('Recipe ID must be a number');
    }
  }

  // GET /recipes/?title=Pizza
  @Get()
  async searchRecipeByTitle(
    @Query() searchDto: SearchRecipeDto
  ): Promise<Recipes[]> {
    return await this.recipesService.searchRecipes(searchDto);
  }

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipes> {
    return this.recipesService.create(createRecipeDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,    
    @Body() updateRecipeDto: UpdateRecipeDto
  ): Promise<Recipes> {    
    return this.recipesService.update(Number(id), updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.remove(Number(id));
  }
}
