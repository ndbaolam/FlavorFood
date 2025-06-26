import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stores as Store } from './entity/store.entity';
import { Users as User } from '../users/entity/users.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createStoreDto: CreateStoreDto,
    user_id: number,
  ): Promise<Store> {
    const user = await this.userRepository.findOneBy({ user_id });
    if (!user) throw new NotFoundException('User not found');

    const store = this.storeRepository.create({
      ...createStoreDto,
      user,
    });

    return this.storeRepository.save(store);
  }

  // async findAll(): Promise<Store[]> {
  //   return this.storeRepository.find({ relations: ['user'] });
  // }
  async findAll(): Promise<Store[]> {
    const stores = await this.storeRepository.find({ relations: ['user'] });
    const now = new Date();

    return stores.map((store) => {
      const expiredAt = store.user.expired_at
        ? new Date(store.user.expired_at)
        : null;

      return {
        ...store,
        status: expiredAt && expiredAt < now ? 'inactive' : store.status,
      };
    });
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { store_id: id },
      relations: ['user', 'ingredients'],
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }
  a;

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    const store = await this.storeRepository.findOneBy({ store_id: id });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    Object.assign(store, updateStoreDto);
    return this.storeRepository.save(store);
  }
}
