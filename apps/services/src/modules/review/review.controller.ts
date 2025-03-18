import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entity/review.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Req() req: Request,
    @Body() { ...dto }: CreateReviewDto
  ): Promise<Review> {
    const user = req['user'];
    if(!user || user === null) {
      throw new UnauthorizedException('Please log in to continue');
    }

    dto.userId = user['sub'];

    return this.reviewService.createReview(dto);
  }

  @Get()  
  async getReviews(
    @Query('userId', ParseIntPipe) userId?: number,
    @Query('recipeId', ParseIntPipe) recipeId?: number,
    @Query('reviewId', ParseIntPipe) reviewId?: number
  ): Promise<Review[]> {
    return this.reviewService.getReviews(
      userId ? Number(userId) : undefined, //filter by userId
      recipeId ? Number(recipeId) : undefined, //filter by recipeId
      reviewId ? Number(reviewId) : undefined //filter by reviewId
    );
  }  

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateReviewDto
  ): Promise<Review> {
    return this.reviewService.updateReview(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteReview(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    return this.reviewService.deleteReview(id);
  }
}
