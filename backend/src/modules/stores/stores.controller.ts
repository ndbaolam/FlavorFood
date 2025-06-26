import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Patch,
  Req,
} from '@nestjs/common';
import { StoreService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { Stores as Store } from './entity/store.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SellerGuard } from '../auth/guards/seller.guard';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Request } from 'express';

@ApiTags('Stores')
@Controller('stores')
@ApiBearerAuth()
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @UseGuards(SellerGuard)
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({ status: 201, description: 'Store created', type: Store })
  async create(
    @Req() req: Request,
    @Body() createStoreDto: CreateStoreDto,
  ): Promise<Store> {
    const user = req['user'];
    const user_id = user['sub'];

    return this.storeService.create(createStoreDto, +user_id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stores' })
  @ApiResponse({ status: 200, description: 'List of stores', type: [Store] })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async findAll(): Promise<Store[]> {
    return this.storeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a store by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'The store', type: Store })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Store> {
    return this.storeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(SellerGuard)
  @ApiOperation({ summary: 'Update a store' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({
    status: 200,
    description: 'Store updated successfully',
    type: Store,
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updateStore(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.update(id, updateStoreDto);
  }
}
