import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entity/subscription.entity';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
  ) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const subscription = this.subscriptionRepo.create(dto);
    return this.subscriptionRepo.save(subscription);
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionRepo.find({ relations: ['invoices'] });
  }

  async findOne(id: number): Promise<Subscription> {
    const sub = await this.subscriptionRepo.findOne({
      where: { subscription_id: id },
      relations: ['invoices'],
    });
    if (!sub) throw new NotFoundException(`Subscription #${id} not found`);
    return sub;
  }

  async update(id: number, dto: UpdateSubscriptionDto): Promise<Subscription> {
    const sub = await this.subscriptionRepo.preload({
      subscription_id: id,
      ...dto,
    });
    if (!sub) throw new NotFoundException(`Subscription #${id} not found`);
    return this.subscriptionRepo.save(sub);
  }

  async remove(id: number): Promise<void> {
    const result = await this.subscriptionRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subscription #${id} not found`);
    }
  }
}