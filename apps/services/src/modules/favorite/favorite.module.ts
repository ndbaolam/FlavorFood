import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entity/favorite.entity';
import { RecipesModule } from '../recipes/recipes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    RecipesModule
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService]
})
export class FavoriteModule {}
