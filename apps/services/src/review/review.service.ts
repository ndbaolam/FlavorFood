import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entity/review.entity';
import { Users } from '../users/entity/users.entity';
import { Recipes } from '../recipes/entity/recipes.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Recipes)
    private readonly recipeRepository: Repository<Recipes>,
  ) {}

  async createReview(dto: CreateReviewDto): Promise<Review> {
    const user = await this.userRepository.findOne({ where: { user_id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const recipe = await this.recipeRepository.findOne({ where: { recipe_id: dto.recipeId } });
    if (!recipe) throw new NotFoundException('Recipe not found');

    const review = this.reviewRepository.create({
      user,
      recipe,
      rating: dto.rating,
      comment: dto.comment,
    });

    return this.reviewRepository.save(review);
  }

  async getAllReviews(): Promise<Review[]> {
    return this.reviewRepository.find({ relations: ['user', 'recipe'] });
  }

  async getReviews(userId?: number, recipeId?: number, reviewId?: number): Promise<Review[]> {
    const query = this.reviewRepository.createQueryBuilder('reviews')
      .leftJoinAndSelect('reviews.user', 'users')
      .leftJoinAndSelect('reviews.recipe', 'recipes');

    if (reviewId) {
      query.andWhere('reviews.review_id = :reviewId', { reviewId });
    }
  
    if (userId) {
      query.andWhere('users.user_id = :userId', { userId });
    }
  
    if (recipeId) {
      query.andWhere('recipes.recipe_id = :recipeId', { recipeId });
    }
  
    return query.getMany();
  }  

  async getReviewById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { review_id: id }, relations: ['user', 'recipe'] });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async updateReview(id: number, dto: UpdateReviewDto): Promise<Review> {
    const review = await this.getReviewById(id);
    Object.assign(review, dto);
    return this.reviewRepository.save(review);
  }

  async deleteReview(id: number): Promise<void> {
    const result = await this.reviewRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Review not found');
  }
}
