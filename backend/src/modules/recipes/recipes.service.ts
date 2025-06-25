import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Recipes } from './entity/recipes.entity';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipes.dto';
import { SearchRecipeDto } from './dto/search-recipes.dto';
import { Ingredient } from './ingredient/entity/ingredient.entity';
import { Nutritrion } from './nutrition/entity/nutrition.entity';
import { Steps } from './steps/entity/step.entity';
import { EmbeddingService } from '../embedding/embedding.service';
import { FavoriteService } from '../favorite/favorite.service';
import pgvector from 'pgvector';
import { features } from 'process';

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

    private readonly favoriteService: FavoriteService,

    private readonly embeddingService: EmbeddingService,

    private readonly dataSource: DataSource,
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
    const { title, description, difficulty_level, offset = 0, limit, categories, feature, most_rating } =
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
  
    // Calculate average rating and review count for each recipe
    recipes = recipes.map(recipe => {
      if (recipe.reviews && recipe.reviews.length > 0) {
        const total = recipe.reviews.reduce((acc, review) => acc + Number(review.rating), 0);
        (recipe as any)['average_rating'] = total / recipe.reviews.length;
      } else {
        (recipe as any)['average_rating'] = 0;
      }
      (recipe as any)['review_count'] = recipe.reviews ? recipe.reviews.length : 0;
      return recipe;
    });
  
    // Apply sorting BEFORE pagination
    if (most_rating) {
      // Sort by highest average rating first
      recipes.sort((a, b) => (b as any)['average_rating'] - (a as any)['average_rating']);
    } else if (feature) {
      // Sort by most number of reviews first
      recipes.sort((a, b) => (b as any)['review_count'] - (a as any)['review_count']);
    }
  
    // Apply pagination AFTER sorting
    const startIndex = offset;
    const endIndex = limit ? startIndex + limit : recipes.length;
    recipes = recipes.slice(startIndex, endIndex);
  
    if (!recipes.length) {
      throw new NotFoundException(
        `No recipes found matching your search criteria.`
      );
    }
  
    return recipes;
  }

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipes> {
    try {
      let {
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
      
      // Embedding
      recipeDetail['embedding'] = await this.embeddingService.generate({
        "title": recipeDetail['title'],
        "description": recipeDetail['description'],
        //"difficulty_level": recipeDetail['difficulty_level']
      });

      if (!recipeDetail['embedding']) {
        throw new ConflictException(
          `Failed to generate embedding for recipe ${recipeDetail.title}.`
        );
      } 

      const insertResult = await this.recipesRepository
        .createQueryBuilder()
        .insert()
        .into(Recipes)
        .values(recipeDetail)
        .execute();

      const recipeId = insertResult.identifiers[0].recipe_id;
      const embeddingVector = pgvector.toSql(recipeDetail['embedding']);

      await this.recipesRepository.query(
        `UPDATE recipes SET embedding=$1 WHERE recipe_id=$2`,
        [embeddingVector, recipeId]
      );

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

  async findSimilarRecipes(embedding: number[], limit = 12): Promise<Recipes[]> {
    const embeddingStr = pgvector.toSql(embedding);
    
    /*
      https://github.com/pgvector/pgvector
      <-> - L2 distance
      <#> - (negative) inner product
      <=> - cosine distance
      <+> - L1 distance
      <~> - Hamming distance (binary vectors)
      <%> - Jaccard distance (binary vectors)
    */
    const query = `
      SELECT *, embedding <=> $1 AS distance
      FROM recipes
      WHERE embedding IS NOT NULL
      ORDER BY distance ASC
      LIMIT $2
    `;
  
    try {
      const result = await this.dataSource.query(query, [embeddingStr, limit]);
      return result;
    } catch (error) {
      console.error('Error finding similar recipes:', error);
      throw new Error(`Failed to find similar recipes: ${error.message}`);
    }
  }
  
  async recommend(userId: number): Promise<Recipes[]> {
    try {
      const favorites = await this.favoriteService.getFavoritesByUserId(userId);
  
      // Handle case where user has no favorites
      if (!favorites || favorites.length === 0) {
        console.log(`User ${userId} has no favorites, returning popular recipes`);
        return this.searchRecipes({
          feature: true,
          most_rating: true,
          limit: 8,
          categories: []
        });
      }
  
      // Generate embeddings for all favorite recipes
      const embeddings = await Promise.all(
        favorites.map(async (item) => {
          const recipe = item.recipe;
  
          // Validate recipe data
          if (!recipe.title || !recipe.description) {
            console.warn(`Recipe ${recipe.recipe_id} missing title or description`);
            return null;
          }
  
          try {
            return await this.embeddingService.generate({
              title: recipe.title,
              description: recipe.description,
            });
          } catch (error) {
            console.error(`Failed to generate embedding for recipe ${recipe.recipe_id}:`, error);
            return null;
          }
        })
      );
  
      // Filter out null embeddings
      const validEmbeddings = embeddings.filter(embedding => embedding !== null);
  
      if (validEmbeddings.length === 0) {
        console.warn(`No valid embeddings generated for user ${userId}`);
        return this.searchRecipes({
          feature: true,
          most_rating: true,
          limit: 8,
          categories: []
        }); // Fallback
      }
  
      // Calculate average and normalize
      const avg = this.embeddingService.average(validEmbeddings);
      const norm = this.embeddingService.normalize(avg);
  
      // Get similar recipes but exclude user's favorites
      const favoriteIds = favorites.map(fav => fav.recipe.recipe_id);
      return this.findSimilarRecipesExcluding(norm, favoriteIds, 12);
  
    } catch (error) {
      console.error(`Error generating recommendations for user ${userId}:`, error);
      throw new Error(`Failed to generate recommendations: ${error.message}`);
    }
  }
  
  async findSimilarRecipesExcluding(embedding: number[], excludeIds: number[], limit = 12): Promise<Recipes[]> {
    const embeddingStr = pgvector.toSql(embedding);
    
    const query = `
      SELECT *, embedding <=> $1 AS distance
      FROM recipes
      WHERE embedding IS NOT NULL
      AND id NOT IN (${excludeIds.map((_, index) => `$${index + 2}`).join(', ')})
      ORDER BY distance ASC
      LIMIT $${excludeIds.length + 2}
    `;
  
    try {
      const params = [embeddingStr, ...excludeIds, limit];
      const result = await this.dataSource.query(query, params);
      return result;
    } catch (error) {
      console.error('Error finding similar recipes excluding favorites:', error);
      // Fallback to regular similarity search if excluding fails
      return this.findSimilarRecipes(embedding, limit);
    }
  }
}
