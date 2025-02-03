import { Controller, Get, Post, Body, Param, Put, Delete, Query, BadRequestException } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipes.dto';
import { Recipes } from './entity/recipes.entity';
import { SearchRecipeDto } from './dto/search-recipes.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  findAll(): Promise<Recipes[]> {
    return this.recipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Recipes>  {
    try {
      return this.recipesService.findOne(id);
    } catch (error) {
      throw new BadRequestException("Recipe ID must be a number");
    }    
  }

   // GET /recipes/?title=Pizza
   @Get()
   async searchRecipeByTitle(@Query() searchDto: SearchRecipeDto): Promise<Recipes[]> {
     return await this.recipesService.searchRecipes(searchDto);
   }

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipes> {
    return this.recipesService.create(createRecipeDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.recipesService.remove(id);
  }
}
