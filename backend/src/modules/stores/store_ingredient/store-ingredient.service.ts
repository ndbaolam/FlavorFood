import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreIngredient } from '../entity/store_ingredient.entity';
import { CreateStoreIngredientDto } from '../dto/create-store-ingredient.dto';
import { UpdateStoreIngredientDto } from '../dto/update-store-ingredient.dto';
import { Stores as Store } from '../entity/store.entity';

@Injectable()
export class StoreIngredientService {
  constructor(
    @InjectRepository(StoreIngredient)
    private readonly storeIngredientRepository: Repository<StoreIngredient>,

    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(
    createStoreIngredientDto: CreateStoreIngredientDto,
  ): Promise<StoreIngredient> {
    const { price, title, quantity, unit, store_id } = createStoreIngredientDto;

    const store = await this.storeRepository.findOne({ where: { store_id } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const storeIngredient = this.storeIngredientRepository.create({
      price,
      title,
      quantity,
      unit,
      store: { store_id },
    });

    return this.storeIngredientRepository.save(storeIngredient);
  }

  async findOne(id: number): Promise<StoreIngredient> {
    const ingredient = await this.storeIngredientRepository.findOne({
      where: { ingredient_id: id },
      relations: ['store'],
    });
    if (!ingredient) {
      throw new NotFoundException('Store ingredient not found');
    }
    return ingredient;
  }

  async update(
    id: number,
    updateStoreIngredientDto: UpdateStoreIngredientDto,
  ): Promise<StoreIngredient> {
    const ingredient = await this.storeIngredientRepository.preload({
      ingredient_id: id,
      ...updateStoreIngredientDto,
    });
    if (!ingredient) {
      throw new NotFoundException('Store ingredient not found');
    }
    return this.storeIngredientRepository.save(ingredient);
  }

  async remove(id: number): Promise<void> {
    const ingredient = await this.findOne(id);
    await this.storeIngredientRepository.remove(ingredient);
  }
}
