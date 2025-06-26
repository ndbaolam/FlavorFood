import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entity/favorite.entity';
import { CreateFavoriteDto } from './dto/favorite.dto';
import { RecipesService } from '../recipes/recipes.service';
import { Recipes } from '../recipes/entity/recipes.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,

    @InjectRepository(Recipes)
    private readonly recipesRepository: Repository<Recipes>,
  ) {}

  async createFavorite(
    createFavoriteDto: CreateFavoriteDto,
  ): Promise<Favorite> {
    try {
      const existedRecipe = this.recipesRepository.findOne({
        where: {
          recipe_id: createFavoriteDto.recipe_id,
        },
      });

      if (!existedRecipe) {
        throw new NotFoundException(
          `Recipe with ID ${createFavoriteDto.recipe_id} not found`,
        );
      }

      const favorite = this.favoriteRepository.create(createFavoriteDto);
      return await this.favoriteRepository.save(favorite);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFavoritesByUserId(user_id: number): Promise<Favorite[]> {
    const favorites = await this.favoriteRepository.find({
      where: { user_id: user_id },
      relations: ['user', 'recipe'],
    });
    if (!favorites) {
      throw new NotFoundException(`Favorites not found`);
    }
    return favorites;
  }

  async deleteFavorite(id: number): Promise<void> {
    const result = await this.favoriteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }
  }
}
