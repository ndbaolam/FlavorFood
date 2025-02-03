import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipes } from './entity/recipes.entity';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipes.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipes)
    private readonly recipesRepository: Repository<Recipes>,
  ) {}

  async findAll(): Promise<Recipes[]> {
    return this.recipesRepository.find();
  }

  async findOne(id: number): Promise<Recipes> {
    const recipe = await this.recipesRepository.findOne({ where: { recipe_id: id } });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    return recipe;
  }

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipes> {
    const newRecipe = this.recipesRepository.create(createRecipeDto);
    return this.recipesRepository.save(newRecipe);
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipes> {
    await this.findOne(id);
    await this.recipesRepository.update(id, updateRecipeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.recipesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
  }
}
