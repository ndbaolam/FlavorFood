import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipes } from './entity/recipes.entity';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { CategoriesModule } from '../categories/categories.module';
import { Ingredient } from './ingredient/entity/ingredient.entity';
import { Nutritrion } from './nutrition/entity/nutrition.entity';
import { Steps } from './steps/entity/step.entity';
import { IngredientModule } from './ingredient/ingredient.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { StepsModule } from './steps/steps.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipes, 
      Ingredient, 
      Nutritrion,
      Steps
    ]),
    CategoriesModule,
    IngredientModule,
    NutritionModule,
    StepsModule
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
