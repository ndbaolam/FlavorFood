import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entity/review.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review (authenticated)' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: Review,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createReview(
    @Req() req: Request,
    @Body() { ...dto }: CreateReviewDto,
  ): Promise<Review> {
    const user = req['user'];
    if (!user) {
      throw new UnauthorizedException('Please log in to continue');
    }

    dto.userId = user['sub'];
    return this.reviewService.createReview(dto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get list of reviews, optionally filter by userId, recipeId, or reviewId',
  })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'recipeId', required: false, type: Number })
  @ApiQuery({ name: 'reviewId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of reviews', type: [Review] })
  async getReviews(
    @Query('userId') userId?,
    @Query('recipeId') recipeId?,
    @Query('reviewId') reviewId?,
  ): Promise<Review[]> {
    return this.reviewService.getReviews(+userId, +recipeId, +reviewId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review by ID (authenticated)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
    type: Review,
  })
  async updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewService.updateReview(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review by ID (authenticated)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Review deleted successfully' })
  async deleteReview(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.reviewService.deleteReview(id);
  }
}
