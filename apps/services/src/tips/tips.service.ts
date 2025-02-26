import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In } from 'typeorm';
import { CreateTipDto, UpdateTipDto } from './dto/tips.dto';
import { Tips } from './entity/tips.entity';
import { TipGenres } from './genres/entity/genres.entity';

@Injectable()
export class TipsService {
  constructor(
    @InjectRepository(Tips)
    private readonly tipsRepository: Repository<Tips>,

    @InjectRepository(TipGenres)
    private readonly genresRepository: Repository<TipGenres>
  ) {}

  async create(createTipDto: CreateTipDto): Promise<Tips> {
    try {
      const { genres, ...tipData } = createTipDto;

      const existedTip = await this.tipsRepository.findOne({
        where: { title: tipData.title },
      });      

      if (existedTip != null) {
        throw new ConflictException(
          `Tip with title ${tipData.title} already exists`
        );
      }

      const tip = this.tipsRepository.create(tipData);

      if (genres.length > 0) {
        const genreEntities = await this.genresRepository.find({
          where: { genre_id: In(genres) },
        });

        const foundGenreIds = genreEntities.map((g) => g.genre_id);
        const missingGenres = genres.filter(
          (id) => !foundGenreIds.includes(id)
        );

        if (missingGenres.length > 0) {
          throw new NotFoundException(
            `Genres not found: ${missingGenres.join(', ')}`
          );
        }

        tip.genres = genreEntities;
      }

      return this.tipsRepository.save(tip);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(): Promise<Tips[]> {
    const tips = await this.tipsRepository.find({ relations: ['genres'] });

    if (!tips || tips.length === 0) {
      throw new NotFoundException('No tips found');
    }

    return tips;
  }

  async findOne(id: number): Promise<Tips> {
    const tip = await this.tipsRepository.findOne({
      where: { tip_id: id },
      relations: ['genres'],
    });
    if (!tip) throw new NotFoundException(`Tip with ID ${id} not found`);
    return tip;
  }

  async search(title?: string, genreIds?: number[]): Promise<Tips[]> {
    const query = this.tipsRepository
      .createQueryBuilder('tips')
      .leftJoinAndSelect('tips.genres', 'genre');

    if (title) {
      query.andWhere('tips.title ILIKE :title', { title: `%${title}%` });
    }

    if (genreIds && genreIds.length > 0) {
      query.andWhere('genre.genre_id IN (:...genreIds)', { genreIds });
    }

    const tips = await query.getMany();

    if (!tips || tips.length === 0) {
      throw new NotFoundException(
        `No tips found with title: '${title}' and genres: [${genreIds?.join(
          ', '
        )}]`
      );
    }

    return tips;
  }

  async update(id: number, updateTipDto: UpdateTipDto): Promise<Tips> {
    const tip = await this.findOne(id);
    const { genres, ...updateData } = updateTipDto;

    Object.assign(tip, updateData);

    if (genres && genres.length > 0) {
      const genreEntities = await this.genresRepository.find({
        where: { genre_id: In(genres) },
      });

      const foundGenreIds = genreEntities.map((g) => g.genre_id);
      const missingGenres = genres.filter((id) => !foundGenreIds.includes(id));

      if (missingGenres.length > 0) {
        throw new NotFoundException(
          `Genres not found: ${missingGenres.join(', ')}`
        );
      }

      tip.genres = genreEntities;
    }

    return this.tipsRepository.save(tip);
  }

  async remove(id: number): Promise<void> {
    const tip = await this.findOne(id);
    await this.tipsRepository.remove(tip);
  }
}
