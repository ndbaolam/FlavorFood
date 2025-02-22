import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from './entity/categories.entity';
import { CreateCategoriesDto, UpdateCategoriesDto } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>
  ) {}

  async create(createCategoriesDto: CreateCategoriesDto): Promise<Categories> {
    const existedCateogry = await this.categoriesRepository.findOne({
      where: { title: createCategoriesDto.title },
    });

    if(existedCateogry) {
      throw new ConflictException(`Category with title ${createCategoriesDto.title} already exists`);
    }

    const category = this.categoriesRepository.create(createCategoriesDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Categories[]> {
    return this.categoriesRepository.find({ relations: ['recipes'] });
  }

  async findOne(id: number): Promise<Categories> {
    const category = await this.categoriesRepository.findOne({
      where: { category_id: id },
      relations: ['recipes'],
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }  

  async update(
    id: number,
    updateCategoriesDto: UpdateCategoriesDto
  ): Promise<Categories> {
    const category = await this.findOne(id);

    if(!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    Object.assign(category, updateCategoriesDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoriesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
  }
}
