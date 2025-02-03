import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipes } from './entity/recipes.entity';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipes.dto';
import { SearchRecipeDto } from './dto/search-recipes.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipes)
    private readonly recipesRepository: Repository<Recipes>
  ) {}

  async findAll(): Promise<Recipes[]> {
    return this.recipesRepository.find();
  }

  async findOne(id: number): Promise<Recipes> {
    const recipe = await this.recipesRepository.findOne({
      where: { recipe_id: id },
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    return recipe;
  }

  async searchRecipes(searchDto: SearchRecipeDto): Promise<Recipes[]> {
    const { title, description, difficulty_level, offset, limit } = searchDto;
    const qb = this.recipesRepository.createQueryBuilder('recipes');

    if (title) {
      qb.andWhere('recipes.title ILIKE :title', { title: `%${title}%` });
    }
    if (description) {
      qb.andWhere('recipes.description ILIKE :description', {
        description: `%${description}%`,
      });
    }
    if (difficulty_level) {
      qb.andWhere('recipes.difficulty_level = :difficulty_level', {
        difficulty_level,
      });
    }

    if (offset) {
      qb.skip(offset);
    }
    if (limit) {
      qb.take(limit);
    }

    const recipes = await qb.getMany();
    if (!recipes.length) {
      throw new NotFoundException(
        `No recipes found matching your search criteria.`
      );
    }
    return recipes;
  }

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipes> {
    try {
      const existedRecipe = await this.recipesRepository.findOne({
        where: { title: createRecipeDto.title },
      });

      if (existedRecipe) {
        throw new ConflictException('The recipe has already existed.');
      }

      const newRecipe = this.recipesRepository.create(createRecipeDto);
      return this.recipesRepository.save(newRecipe);
    } catch (error) {
      if (error.code == '23505') {
        throw new ConflictException('The recipe has already existed.');
      }
      throw Error(error);
    }
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipes> {
    try {
      const recipe = await this.recipesRepository.preload({
        recipe_id: id,
        ...updateRecipeDto,
      });
      if (!recipe) {
        throw new NotFoundException(`Recipe with ID ${id} not found`);
      }
      return this.recipesRepository.save(recipe);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.recipesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
  }
}
