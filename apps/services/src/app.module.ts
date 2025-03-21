import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSourceModule } from './config/datasource.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UploadModule } from './modules/upload/upload.module';
import { HealthcheckModule } from './modules/healthcheck/healthcheck.module';
import { TipsModule } from './modules/tips/tips.module';
import { ReviewModule } from './modules/review/review.module';

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
