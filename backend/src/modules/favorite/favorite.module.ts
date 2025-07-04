import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entity/favorite.entity';
import { Recipes } from '../recipes/entity/recipes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Recipes])],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
