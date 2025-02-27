import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipes } from './entity/recipes.entity';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipes]), CategoriesModule],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService]
})
export class RecipesModule {}
