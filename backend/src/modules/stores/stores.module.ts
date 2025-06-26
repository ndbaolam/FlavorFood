import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stores as Store } from './entity/store.entity';
import { Users as User } from '../users/entity/users.entity';
import { StoreService } from './stores.service';
import { StoreController } from './stores.controller';
import { StoreIngredient } from './entity/store_ingredient.entity';
import { StoreIngredientModule } from './store_ingredient/store-ingredient.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, User, StoreIngredient]),
    StoreIngredientModule,
  ],
  providers: [StoreService],
  controllers: [StoreController],
})
export class StoresModule {}
