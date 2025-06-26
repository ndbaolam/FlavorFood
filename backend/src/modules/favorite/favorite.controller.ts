import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { Favorite } from './entity/favorite.entity';
import { CreateFavoriteDto } from './dto/favorite.dto';
import { Request } from 'express';
import { RecipesService } from '../recipes/recipes.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Favorite')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @ApiOperation({ summary: 'Add a recipe to favorites' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        recipe_id: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Recipe added to favorites',
    type: Favorite,
  })
  async createFavorite(
    @Req() req: Request,
    @Body('recipe_id') recipeId: number,
  ): Promise<Favorite> {
    const user = req['user'];

    if (!user) {
      throw new UnauthorizedException();
    }

    const createFavoriteDto: CreateFavoriteDto = {
      user_id: Number(user['sub']),
      recipe_id: recipeId,
    };

    return await this.favoriteService.createFavorite(createFavoriteDto);
  }

  @Get()
  @ApiOperation({ summary: "Get list of user's favorite recipes" })
  @ApiResponse({
    status: 200,
    description: 'List of favorite recipes',
    type: [Favorite],
  })
  async getFavorites(@Req() req: Request): Promise<Favorite[]> {
    const user = req['user'];

    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.favoriteService.getFavoritesByUserId(Number(user['sub']));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a recipe from favorites by favorite ID' })
  @ApiParam({ name: 'id', type: Number, example: 5 })
  @ApiResponse({
    status: 200,
    description: 'Favorite recipe removed',
  })
  async deleteFavorite(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.favoriteService.deleteFavorite(Number(id));
  }
}
