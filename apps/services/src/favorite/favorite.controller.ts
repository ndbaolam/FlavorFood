import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { Favorite } from './entity/favorite.entity';
import { CreateFavoriteDto } from './dto/favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

@Controller('favorite')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  async createFavorite(
    @Req() req: Request,
    @Body('recipe_id') recipeId: number
  ): Promise<Favorite> {
    try {
      const createFavoriteDto: CreateFavoriteDto = {
        user_id: Number(req['sub']),
        recipe_id: Number(recipeId),
      };
      return await this.favoriteService.createFavorite(createFavoriteDto);
    } catch (error) {
      throw new Error(error);
    }    
  }

  @Get()  
  async getFavorites(@Req() req: Request): Promise<Favorite[]> {
    return await this.favoriteService.getFavoritesByUserId(Number(req['sub']));
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