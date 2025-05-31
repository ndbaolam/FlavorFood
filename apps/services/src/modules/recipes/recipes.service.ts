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
      .leftJoinAndSelect('recipes.reviews', 'reviews')
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
    const { title, description, difficulty_level, offset, limit, categories, feature, most_rating } =
      searchDto;
    const qb = this.recipesRepository
      .createQueryBuilder('recipes')
      .leftJoin('recipes.categories', 'categories')
      .leftJoinAndSelect('recipes.ingredients', 'ingredients')
      .leftJoinAndSelect('recipes.nutrition', 'nutrition')
      .leftJoinAndSelect('recipes.reviews', 'reviews')
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

    let recipes = await qb.getMany();

    recipes.map(recipe => {
      if (recipe.reviews && recipe.reviews.length > 0) {
        const total = recipe.reviews.reduce((acc, review) => acc + Number(review.rating), 0);
        recipe['average_rating'] = total / recipe.reviews.length;
      } else {
        recipe['average_rating'] = 0;
      }
      recipe['review_count'] = recipe.reviews.length;
    })

    if (offset) {
      recipes = recipes.slice(offset);
    }

    if (limit) {
      recipes = recipes.slice(0, limit);
    }

    if (!recipes.length) {
      throw new NotFoundException(
        `No recipes found matching your search criteria.`
      );
    }

    recipes.sort((a, b) => {
      if (feature && most_rating) {
        return b['average_rating'] - a['average_rating'];
      } else if (feature) {
        return b['review_count'] - a['review_count'];
      } else if (most_rating) {
        return b['average_rating'] - a['average_rating'];
      }
      return 0;
    })

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
        relations: ['ingredients', 'categories', 'nutrition', 'steps'],
      });
  
      if (!existingRecipe) {
        throw new NotFoundException(`Recipe with id ${recipeId} not found.`);
      }
  
      const updateObj: Partial<Recipes> = {};
      if (updateRecipeDto.title) updateObj.title = updateRecipeDto.title;
      if (updateRecipeDto.description) updateObj.description = updateRecipeDto.description;      
      if (updateRecipeDto.difficulty_level) updateObj.difficulty_level = updateRecipeDto.difficulty_level;      
      if (updateRecipeDto.image) updateObj.image = updateRecipeDto.image;
      if (updateRecipeDto.serving) updateObj.serving = updateRecipeDto.serving;
      if (updateRecipeDto.time) updateObj.time = updateRecipeDto.time;
  
      if (Object.keys(updateObj).length > 0) {
        await this.recipesRepository
          .createQueryBuilder()
          .update(Recipes)
          .set(updateObj)
          .where('recipe_id = :recipeId', { recipeId })
          .execute();
      }
  
      if (updateRecipeDto.categories) {
        if (existingRecipe.categories && existingRecipe.categories.length > 0) {
          await this.recipesRepository
            .createQueryBuilder()
            .relation(Recipes, 'categories')
            .of(recipeId)
            .remove(existingRecipe.categories.map((c) => c.category_id));
        }
      
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
          .where('recipeRecipeId = :recipeId', { recipeId })
          .execute();
  
        if (updateRecipeDto.ingredients.length > 0) {
          const newIngredients = updateRecipeDto.ingredients
          .filter((ingredient) => ingredient.ingredient)
          .map((ingredient) => ({
            ingredient: ingredient.ingredient,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            recipe: { recipe_id: recipeId } as Recipes,
          }));

          
          await Promise.all(
            newIngredients.map(i =>
              this.ingredientsRepository.save({
                ingredient: i.ingredient,
                quantity: i.quantity,
                unit: i.unit,
                recipe: { recipe_id: recipeId } as Recipes,
              })
            )
          );
        }
      }

      if (updateRecipeDto.nutrition) {
        await this.nutritionRepository
          .createQueryBuilder()
          .delete()
          .from(Nutritrion)
          .where('recipeRecipeId = :recipeId', { recipeId })
          .execute();
      
        if (updateRecipeDto.nutrition.length > 0) {
          const newNutrition = updateRecipeDto.nutrition
            .filter((item) => item.name)
            .map((item) => ({
              name: item.name,
              amount: item.amount,
              unit: item.unit,
              recipe: { recipe_id: recipeId } as Recipes,
            }));
      
          await Promise.all(
            newNutrition.map((n) =>
              this.nutritionRepository.save({
                name: n.name,
                amount: n.amount,
                unit: n.unit,
                recipe: { recipe_id: recipeId } as Recipes,
              })
            )
          );
        }
      }
      

      if (updateRecipeDto.steps) {
        await this.stepRepository
          .createQueryBuilder()
          .delete()
          .from(Steps)
          .where('recipeRecipeId = :recipeId', { recipeId })
          .execute();
      
        if (updateRecipeDto.steps.length > 0) {
          const newSteps = updateRecipeDto.steps
            .filter((item) => item.step)
            .map((item) => ({
              number: item.number,
              step: item.step,
              recipe: { recipe_id: recipeId } as Recipes,
            }));
      
          await Promise.all(
            newSteps.map((s) =>
              this.stepRepository.save({
                number: s.number,
                step: s.step,
                recipe: { recipe_id: recipeId } as Recipes,
              })
            )
          );
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
