import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipes } from './entity/recipes.entity';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Recipes])],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService]
})
export class RecipesModule {}
