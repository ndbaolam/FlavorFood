import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSourceModule } from './config/datasource.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    ConfigModule.forRoot({      
      isGlobal: true
    }),
    DataSourceModule,    

    //FeatureModule
    UsersModule,
    AuthModule,
    RecipesModule
  ],  
})
export class AppModule {}
