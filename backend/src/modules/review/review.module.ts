import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entity/review.entity';
import { Users } from '../users/entity/users.entity';
import { Recipes } from '../recipes/entity/recipes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Users, Recipes])],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
