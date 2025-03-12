import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipes } from './entity/recipes.entity';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { CategoriesModule } from '../categories/categories.module';
import { Ingredient } from '../ingredient/entity/ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipes, Ingredient]), CategoriesModule],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService]
})
export class RecipesModule {}
