import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nutritrion } from './entity/nutrition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nutritrion])]
})
export class NutritionModule {}
