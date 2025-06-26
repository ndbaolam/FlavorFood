import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipGenres } from './entity/genres.entity';
import { CreateGenreDto, UpdateGenreDto } from './dto/genres.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(TipGenres)
    private readonly genresRepository: Repository<TipGenres>,
  ) {}

  async findAll(): Promise<TipGenres[]> {
    return this.genresRepository.find();
  }

  async findOne(id: number): Promise<TipGenres> {
    const genre = await this.genresRepository.findOne({
      where: { genre_id: id },
    });
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    return genre;
  }

  async create(createGenreDto: CreateGenreDto): Promise<TipGenres> {
    const existedGenre = await this.genresRepository.findOne({
      where: { title: createGenreDto.title },
    });

    if (existedGenre) {
      throw new NotFoundException(
        `Genre with title ${createGenreDto.title} already exists`,
      );
    }

    const genre = this.genresRepository.create(createGenreDto);
    return this.genresRepository.save(genre);
  }

  async update(id: number, updateGenreDto: UpdateGenreDto): Promise<TipGenres> {
    const genre = await this.findOne(id);
    Object.assign(genre, updateGenreDto);
    return this.genresRepository.save(genre);
  }

  async delete(id: number): Promise<void> {
    const genre = await this.findOne(id);
    await this.genresRepository.remove(genre);
  }
}
