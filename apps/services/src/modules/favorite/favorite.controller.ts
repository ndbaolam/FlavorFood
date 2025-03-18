import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, ParseIntPipe, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { Favorite } from './entity/favorite.entity';
import { CreateFavoriteDto } from './dto/favorite.dto';
import { Request } from 'express';
import { RecipesService } from '../recipes/recipes.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('favorite')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly recipesService: RecipesService
  ) {}

  @Post()
  async createFavorite(
    @Req() req: Request,
    @Body('recipe_id') recipeId: number
  ): Promise<Favorite> {
    const user = req['user'];

    if(!user) {
      throw new UnauthorizedException();
    }

    const recipe = await this.recipesService.findOne(Number(recipeId));    

    try {
      const createFavoriteDto: CreateFavoriteDto = {
        user_id: Number(user['sub']),
        recipe_id: recipe.recipe_id,
      };
      return await this.favoriteService.createFavorite(createFavoriteDto);
    } catch (error) {
      throw new Error(error);
    }    
  }

  @Get()  
  async getFavorites(@Req() req: Request): Promise<Favorite[]> {
    const user = req['user'];

    if(!user) {
      throw new UnauthorizedException();
    }

    return await this.favoriteService.getFavoritesByUserId(Number(user['sub']));
  }

  // @Get(':id')
  // async getFavorite(@Param('id') id: string): Promise<Favorite> {
  //   return await this.favoriteService.getFavoriteById(Number(id));
  // }

  @Delete(':id')
  async deleteFavorite(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.favoriteService.deleteFavorite(Number(id));
  }
}