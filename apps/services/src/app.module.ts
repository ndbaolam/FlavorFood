import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSourceModule } from './config/datasource.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';
import { FavoriteModule } from './favorite/favorite.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadModule } from './upload/upload.module';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { TipsModule } from './tips/tips.module';
import { ReviewModule } from './review/review.module';

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
    HealthcheckModule,
    TipsModule,
    ReviewModule,    
  ],  
})
export class AppModule {}
