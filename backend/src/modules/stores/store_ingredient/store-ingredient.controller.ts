import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StoreIngredientService } from './store-ingredient.service';
import { CreateStoreIngredientDto } from '../dto/create-store-ingredient.dto';
import { UpdateStoreIngredientDto } from '../dto/update-store-ingredient.dto';
import { StoreIngredient } from '../entity/store_ingredient.entity';
import { SellerGuard } from '../../auth/guards/seller.guard';

@ApiTags('Store Ingredients')
@ApiBearerAuth('access-token')
// @UseGuards(SellerGuard)
@Controller('store-ingredients')
export class StoreIngredientController {
  constructor(
    private readonly storeIngredientService: StoreIngredientService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new store ingredient' })
  @ApiResponse({
    status: 201,
    description: 'Ingredient created successfully',
    type: StoreIngredient,
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async create(
    @Body() createStoreIngredientDto: CreateStoreIngredientDto,
  ): Promise<StoreIngredient> {
    return this.storeIngredientService.create(createStoreIngredientDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a store ingredient by ID' })
  @ApiResponse({
    status: 200,
    description: 'The ingredient found',
    type: StoreIngredient,
  })
  @ApiResponse({ status: 404, description: 'Ingredient not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StoreIngredient> {
    return this.storeIngredientService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a store ingredient by ID' })
  @ApiResponse({
    status: 200,
    description: 'Ingredient updated successfully',
    type: StoreIngredient,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoreIngredientDto: UpdateStoreIngredientDto,
  ): Promise<StoreIngredient> {
    return this.storeIngredientService.update(+id, updateStoreIngredientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a store ingredient by ID' })
  @ApiResponse({ status: 200, description: 'Ingredient deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ingredient not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.storeIngredientService.remove(+id);
  }
}
