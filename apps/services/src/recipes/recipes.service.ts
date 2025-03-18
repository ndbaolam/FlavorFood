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
import { Ingredient } from './ingredient/entity/ingredient.entity';
import { Nutritrion } from './nutrition/entity/nutrition.entity';
import { Steps } from './steps/entity/step.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipes)
    private readonly recipesRepository: Repository<Recipes>,    

    @InjectRepository(Ingredient)
    private readonly ingredientsRepository: Repository<Ingredient>,

    @InjectRepository(Nutritrion)
    private readonly nutritionRepository: Repository<Nutritrion>,

    @InjectRepository(Steps)
    private readonly stepRepository: Repository<Steps>,
  ) {}

  async findOne(id: number): Promise<Recipes> {
    const recipe = await this.recipesRepository
    .createQueryBuilder('recipes')
    .leftJoin('recipes.categories', 'categories')
    .leftJoinAndSelect('recipes.ingredients', 'ingredients')
    .leftJoinAndSelect('recipes.nutrition', 'nutrition')
    .leftJoin('recipes.steps', 'steps')
    .addSelect(['categories.category_id', 'categories.title'])    
    .addSelect(['steps.number', 'steps.step'])
    .where('recipes.recipe_id = :id', { id })
    .getOne();
    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found.`);
    }
    return recipe;
  }

  async searchRecipes(searchDto: SearchRecipeDto): Promise<Recipes[]> {
    const { title, description, difficulty_level, offset, limit, categories, lang } =
      searchDto;
    const qb = this.recipesRepository
      .createQueryBuilder('recipes')
      .leftJoin('recipes.categories', 'categories')
      .leftJoinAndSelect('recipes.ingredients', 'ingredients')
      .leftJoinAndSelect('recipes.nutrition', 'nutrition')
      .leftJoin('recipes.steps', 'steps')
      .addSelect(['categories.category_id', 'categories.title'])    
      .addSelect(['steps.number', 'steps.step']);

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
        nutrition,
        steps,
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

      if (nutrition?.length > 0) {
        const nutritionToInsert = nutrition.map((nutrient) => ({
          ...nutrient,
          recipe: recipeId,
        }));
  
        await this.nutritionRepository
          .createQueryBuilder()
          .insert()
          .into(Nutritrion)
          .values(nutritionToInsert)
          .execute();
      }

      if (steps?.length > 0) {
        const stepsToInsert = steps.map((step) => ({
          ...step,
          recipe: recipeId,
        }));
  
        await this.stepRepository
          .createQueryBuilder()
          .insert()
          .into(Steps)
          .values(stepsToInsert)
          .execute();
      }

      const createdRecipe = await this.recipesRepository
        .createQueryBuilder('recipes')
        .leftJoin('recipes.categories', 'categories')
        .leftJoinAndSelect('recipes.ingredients', 'ingredients')
        .leftJoinAndSelect('recipes.nutrition', 'nutrition') 
        .leftJoin('recipes.steps', 'steps')      
        .addSelect(['categories.category_id', 'categories.title'])    
        .addSelect(['steps.number', 'steps.step'])
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

      if (updateRecipeDto.nutrition) {
        await this.nutritionRepository
          .createQueryBuilder()
          .delete()
          .from(Nutritrion)
          .where('recipe_id = :recipeId', { recipeId })
          .execute();
  
        if (updateRecipeDto.nutrition.length > 0) {
          const newNutrition = updateRecipeDto.nutrition.map((item) => ({
            ...item,
            recipe: { recipe_id: recipeId } as Recipes,
          }));
  
          await this.nutritionRepository
            .createQueryBuilder()
            .insert()
            .into(Ingredient)
            .values(newNutrition)
            .execute();
        }
      }

      if (updateRecipeDto.steps) {
        await this.stepRepository
          .createQueryBuilder()
          .delete()
          .from(Steps)
          .where('recipe_id = :recipeId', { recipeId })
          .execute();
  
        if (updateRecipeDto.steps.length > 0) {
          const newSteps = updateRecipeDto.steps.map((item) => ({
            ...item,
            recipe: { recipe_id: recipeId } as Recipes,
          }));
  
          await this.stepRepository
            .createQueryBuilder()
            .insert()
            .into(Ingredient)
            .values(newSteps)
            .execute();
        }
      }
  
      const updatedRecipe = await this.recipesRepository
        .createQueryBuilder('recipes')
        .leftJoin('recipes.categories', 'categories')
        .leftJoinAndSelect('recipes.ingredients', 'ingredients')
        .leftJoinAndSelect('recipes.nutrition', 'nutrition')
        .leftJoin('recipes.steps', 'steps')     
        .addSelect(['categories.category_id', 'categories.title'])    
        .addSelect(['steps.number', 'steps.step'])  
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
