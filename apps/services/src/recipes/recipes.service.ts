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
import { CategoriesService } from '../categories/categories.service';
import { Ingredient } from '../ingredient/entity/ingredient.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipes)
    private readonly recipesRepository: Repository<Recipes>,

    private readonly categoriesService: CategoriesService,

    @InjectRepository(Ingredient)
    private readonly ingredientsRepository: Repository<Ingredient>
  ) {}

  async findOne(id: number): Promise<Recipes> {
    const recipe = await this.recipesRepository
      .createQueryBuilder('recipes')
      .leftJoin('recipes.categories', 'categories')
      .leftJoin('recipes.ingredients', 'ingredients')
      .addSelect(['categories.category_id', 'categories.title'])      
      .addSelect([
        'ingredients.id',
        'ingredients.ingredient',
        'ingredients.quantity',
        'ingredients.unit',
      ])
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
      .leftJoin('recipes.ingredients', 'ingredients')
      .addSelect(['categories.category_id', 'categories.title'])
      .addSelect([
        'ingredients.id',
        'ingredients.ingredient',
        'ingredients.quantity',
        'ingredients.unit',
      ]);

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
      const {
        categories: categoryIds,
        ingredients,
        ...recipeDetail
      } = createRecipeDto;

      const existingRecipe: Recipes = await this.recipesRepository
        .createQueryBuilder('recipes')
        .where('recipes.title = :title', { title: recipeDetail.title })
        .getOne();

      if (existingRecipe instanceof Recipes) {
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
          .of({recipe_id: recipeId})
          .add(categoryIds);
      }
      
      if (ingredients && ingredients.length > 0) {
        const ingredientsToInsert = ingredients.map((ingredient) => ({
          ...ingredient,
          recipe: recipeId,
        }));

        await this.ingredientsRepository
          .createQueryBuilder()
          .insert()
          .into(Ingredient)
          .values(ingredientsToInsert)
          .execute();
      }

      const createdRecipe = await this.recipesRepository
        .createQueryBuilder('recipes')
        .leftJoin('recipes.categories', 'categories')
        .leftJoin('recipes.ingredients', 'ingredients')
        .addSelect(['categories.category_id', 'categories.title'])
        .addSelect([
          'ingredients.id',
          'ingredients.ingredient',
          'ingredients.quantity',
          'ingredients.unit',
        ])
        .where('recipes.recipe_id = :recipeId', { recipeId })
        .getOne();

      return createdRecipe;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(
    recipeId: number,
    updateRecipeDto: UpdateRecipeDto
  ): Promise<Recipes> {
    try {
      const existingRecipe = await this.recipesRepository.findOne({
        where: { recipe_id: recipeId },
        relations: ['ingredients'],
      });
  
      if (!existingRecipe) {
        throw new NotFoundException(`Recipe with id ${recipeId} not found.`);
      }
  
      const updateObj: Partial<Recipes> = {};
      if (updateRecipeDto.title) updateObj.title = updateRecipeDto.title;
      if (updateRecipeDto.description) updateObj.description = updateRecipeDto.description;
      if (updateRecipeDto.step) updateObj.step = updateRecipeDto.step;
      if (updateRecipeDto.nutrition) updateObj.nutrition = updateRecipeDto.nutrition;
      if (updateRecipeDto.difficulty_level) updateObj.difficulty_level = updateRecipeDto.difficulty_level;
  
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
          .remove(existingRecipe.categories.map((c) => c.category_id));
  
        await this.recipesRepository
          .createQueryBuilder()
          .relation(Recipes, 'categories')
          .of(recipeId)
          .add(updateRecipeDto.categories);
      }
  
      if (updateRecipeDto.ingredients) {
        await this.ingredientsRepository
          .createQueryBuilder()
          .delete()
          .from(Ingredient)
          .where('recipe_id = :recipeId', { recipeId })
          .execute();
  
        if (updateRecipeDto.ingredients.length > 0) {
          const newIngredients = updateRecipeDto.ingredients.map((ingredient) => ({
            ...ingredient,
            recipe: { recipe_id: recipeId } as Recipes,
          }));
  
          await this.ingredientsRepository
            .createQueryBuilder()
            .insert()
            .into(Ingredient)
            .values(newIngredients)
            .execute();
        }
      }
  
      const updatedRecipe = await this.recipesRepository
        .createQueryBuilder('recipes')
        .leftJoin('recipes.categories', 'categories')
        .leftJoin('recipes.ingredients', 'ingredients')
        .addSelect(['categories.category_id', 'categories.title'])
        .addSelect(['ingredients.id', 'ingredients.ingredient', 'ingredients.quantity', 'ingredients.unit'])
        .where('recipes.recipe_id = :recipeId', { recipeId })
        .getOne();
  
      if (!updatedRecipe) {
        throw new NotFoundException(`Recipe with id ${recipeId} not found.`);
      }
  
      return updatedRecipe;
    } catch (error) {
      throw new Error(error.message);
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
