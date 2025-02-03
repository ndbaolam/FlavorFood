import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entity/favorite.entity';
import { CreateFavoriteDto } from './dto/favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async createFavorite(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {    
    const favorite = this.favoriteRepository.create(createFavoriteDto);
    return await this.favoriteRepository.save(favorite);
  }

  async getFavoritesByUserId(user_id: number): Promise<Favorite[]> {    
    const favorites = await this.favoriteRepository.find({
      where: { user_id: user_id },
      relations: ['user', 'recipe'],
    });
    if (!favorites) {
      throw new NotFoundException(`Favorites not found`);
    }
    return favorites;
  }  

  async deleteFavorite(id: number): Promise<void> {
    const result = await this.favoriteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }
  }
}
