import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipes } from './entity/recipes.entity';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipes.dto';
import { SearchRecipeDto } from './dto/search-recipes.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipes)
    private readonly recipesRepository: Repository<Recipes>
  ) {}

  async findOne(id: number): Promise<Recipes> {
    const recipe = await this.recipesRepository
      .createQueryBuilder('recipes')
      .leftJoin('recipes.categories', 'categories')
      .addSelect('categories.title')
      .where('recipes.recipe_id = :id', { id })
      .getOne();
    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found.`);
    }
    return recipe;
  }

  async searchRecipes(searchDto: SearchRecipeDto): Promise<Recipes[]> {
    const { title, description, difficulty_level, offset, limit, categories } =
      searchDto;
    const qb = this.recipesRepository
      .createQueryBuilder('recipes')
      .leftJoin('recipes.categories', 'categories')
      .addSelect('categories.title');

    if (title) {
      qb.andWhere('recipes.title ILIKE :title', { title: `%${title}%` });
    }
    if (description) {
      qb.andWhere('recipes.description ILIKE :description', {
        description: `%${description}%`,
      });
    }
    if (difficulty_level) {
      qb.andWhere('recipes.difficulty_level = :difficulty_level', {
        difficulty_level,
      });
    }
    if (categories && categories.length > 0) {
      qb.andWhere('categories.title IN (:...categories)', { categories });
    }

    if (offset) {
      qb.skip(offset);
    }
    if (limit) {
      qb.take(limit);
    }

    const recipes = await qb.getMany();
    if (!recipes.length) {
      throw new NotFoundException(
        `No recipes found matching your search criteria.`
      );
    }
    return recipes;
  }

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipes> {
    try {
      const { categories: categoryIds, ...recipeDetail } = createRecipeDto;      

      const existingRecipe = await this.recipesRepository
        .createQueryBuilder('recipes')
        .where('recipes.title = :title', { title: recipeDetail.title })
        .getOne();

      if (existingRecipe) {
        throw new ConflictException(
          `Recipe with title ${recipeDetail.title} already exists.`
        );
      }

      const insertResult = await this.recipesRepository
        .createQueryBuilder()
        .insert()
        .into(Recipes)
        .values(recipeDetail)
        .execute();

      const recipeId = insertResult.identifiers[0].recipe_id;

      if (categoryIds && categoryIds.length > 0) {
        await this.recipesRepository
          .createQueryBuilder()
          .relation(Recipes, 'categories')
          .of(recipeId)
          .add(categoryIds);
      }

      const createdRecipe = await this.recipesRepository
        .createQueryBuilder('recipes')
        .leftJoin('recipes.categories', 'categories')
        .addSelect('categories.title')
        .where('recipes.recipe_id = :recipeId', { recipeId })
        .getOne();

      return createdRecipe;
    } catch (error) {
      throw Error(error);
    }
  }

  async update(
    recipeId: number,
    updateRecipeDto: UpdateRecipeDto
  ): Promise<Recipes> {
    try {
      const exitsedRecipe = await this.recipesRepository.findOne({
        where: { recipe_id : recipeId}
      });
      
      if(!exitsedRecipe) {
        throw new NotFoundException(`Recipe with id ${recipeId} not found.`);
      }

      const updateObj: Partial<Recipes> = {};
      if (updateRecipeDto.title) {
        updateObj.title = updateRecipeDto.title;
      }
      if (updateRecipeDto.description) {
        updateObj.description = updateRecipeDto.description;
      }

      if (Object.keys(updateObj).length > 0) {
        await this.recipesRepository
          .createQueryBuilder()
          .update(Recipes)
          .set(updateObj)
          .where('recipe_id = :recipeId', { recipeId })
          .execute();
      }

      if (updateRecipeDto.categories) {
        await this.recipesRepository
          .createQueryBuilder()
          .relation(Recipes, 'categories')
          .of(recipeId)
          .remove(recipeId);

        await this.recipesRepository
          .createQueryBuilder()
          .relation(Recipes, 'categories')
          .of(recipeId)
          .add(updateRecipeDto.categories);
      }

      const updatedRecipe = await this.recipesRepository
        .createQueryBuilder('recipes')
        .leftJoin('recipes.categories', 'categories')
        .addSelect('categories.title')
        .where('recipes.recipe_id = :recipeId', { recipeId })
        .getOne();

      if (!updatedRecipe) {
        throw new NotFoundException(`Recipe with id ${recipeId} not found.`);
      }

      return updatedRecipe;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.recipesRepository
      .createQueryBuilder()
      .delete()
      .from(Recipes)
      .where('recipe_id = :id', { id })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
  }
}
