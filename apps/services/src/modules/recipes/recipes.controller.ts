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
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipes.dto';
import { Recipes } from './entity/recipes.entity';
import { SearchRecipeDto } from './dto/search-recipes.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get recipe by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Recipe found', type: Recipes })
  @ApiResponse({ status: 400, description: 'Recipe ID must be a number' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Recipes> {
    try {
      return this.recipesService.findOne(Number(id));
    } catch (error) {
      throw new BadRequestException('Recipe ID must be a number');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Search recipes by title' })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of matching recipes', type: [Recipes] })
  async searchRecipeByTitle(
    @Query() searchDto: SearchRecipeDto
  ): Promise<Recipes[]> {
    return await this.recipesService.searchRecipes(searchDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new recipe' })
  @ApiBody({ type: CreateRecipeDto })
  @ApiResponse({ status: 201, description: 'Recipe created successfully', type: Recipes })
  async create(
    @Body() createRecipeDto: CreateRecipeDto
  ): Promise<Recipes> {
    return this.recipesService.create(createRecipeDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update recipe by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateRecipeDto })
  @ApiResponse({ status: 200, description: 'Recipe updated successfully', type: Recipes })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto
  ): Promise<Recipes> {
    return this.recipesService.update(Number(id), updateRecipeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recipe by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Recipe deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.remove(Number(id));
  }
}
