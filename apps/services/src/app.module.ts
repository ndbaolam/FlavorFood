import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSourceModule } from './config/datasource.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';
import { FavoriteModule } from './favorite/favorite.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadModule } from './upload/upload.module';
import { HealcheckModule } from './healcheck/healcheck.module';
import { TipsModule } from './tips/tips.module';

@Module({
  imports: [
    ConfigModule.forRoot({      
      isGlobal: true
    }),
    DataSourceModule,    

    //FeatureModule
    UsersModule,
    AuthModule,
    RecipesModule,
    FavoriteModule,
    CategoriesModule,
    UploadModule,
    HealcheckModule,
    TipsModule
  ],  
})
export class AppModule {}
