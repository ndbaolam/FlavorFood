import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreIngredient } from '../entity/store_ingredient.entity';
import { StoreIngredientService } from './store-ingredient.service';
import { StoreIngredientController } from './store-ingredient.controller';
import { Stores as Store } from '../entity/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreIngredient, Store])], 
  controllers: [StoreIngredientController],
  providers: [StoreIngredientService],
})
export class StoreIngredientModule {}
