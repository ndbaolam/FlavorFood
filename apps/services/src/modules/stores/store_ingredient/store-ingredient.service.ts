import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreIngredient } from '../entity/store_ingredient.entity';
import { CreateStoreIngredientDto } from '../dto/create-store-ingredient.dto';
import { UpdateStoreIngredientDto } from '../dto/update-store-ingredient.dto';

@Injectable()
export class StoreIngredientService {
  constructor(
    @InjectRepository(StoreIngredient)
    private readonly storeIngredientRepository: Repository<StoreIngredient>,
  ) {}

  async create(createStoreIngredientDto: CreateStoreIngredientDto): Promise<StoreIngredient> {
    const storeIngredient = this.storeIngredientRepository.create(createStoreIngredientDto);
    return this.storeIngredientRepository.save(storeIngredient);
  }

  async findOne(id: string): Promise<StoreIngredient> {
    const ingredient = await this.storeIngredientRepository.findOneBy({ingredient_id: id});
    if (!ingredient) {
      throw new NotFoundException('Store ingredient not found');
    }
    return ingredient;
  }

  async update(id: string, updateStoreIngredientDto: UpdateStoreIngredientDto): Promise<StoreIngredient> {
    const ingredient = await this.storeIngredientRepository.preload({
      ingredient_id: id,
      ...updateStoreIngredientDto,
    });
    if (!ingredient) {
      throw new NotFoundException('Store ingredient not found');
    }
    return this.storeIngredientRepository.save(ingredient);
  }

  async remove(id: string): Promise<void> {
    const ingredient = await this.findOne(id);
    await this.storeIngredientRepository.remove(ingredient);
  }
}
