import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Tips } from './entity/tips.entity';
import { CreateTipDto, UpdateTipDto } from './dto/tips.dto';

@Injectable()
export class TipsService {
  constructor(
    @InjectRepository(Tips)
    private readonly tipsRepository: Repository<Tips>,
  ) {}

  async create(createTipDto: CreateTipDto): Promise<Tips> {
    try {
      const tip = this.tipsRepository.create(createTipDto);
      return this.tipsRepository.save(tip);
    } catch (error) {
      throw new Error(error);
    }    
  }

  async findAll(): Promise<Tips[]> {
    const tips = this.tipsRepository.find();

    if(!tips) {
      throw new NotFoundException('No tips found');
    }

    return tips;
  }

  async findOne(id: number): Promise<Tips> {
    const tip = await this.tipsRepository.findOne({ where: { tip_id: id } });
    if (!tip) throw new NotFoundException(`Tip with ID ${id} not found`);
    return tip;
  }

  async searchByTitle(title: string): Promise<Tips[]> {
    const searched_tip = await this.tipsRepository.find({
      where: { title: Like(`%${title}%`) },
    });

    if(!searched_tip) {
      throw new NotFoundException(`No tips found with title: ${title}`);
    }

    return searched_tip;
  }

  async update(id: number, updateTipDto: UpdateTipDto): Promise<Tips> {
    const tip = await this.findOne(id);

    if(!tip) {
      throw new NotFoundException(`Tip with ID ${id} not found`);
    }

    Object.assign(tip, updateTipDto);
    return this.tipsRepository.save(tip);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tipsRepository.delete(id);
    if (result.affected === 0) 
      throw new NotFoundException(`Tip with ID ${id} not found`);    
  }
}
