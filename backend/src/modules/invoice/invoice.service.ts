import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entity/invoice.entity';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { Users } from '../users/entity/users.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Users)
      private readonly userRepository: Repository<Users>,
  ) {}

  async create(userId: number, createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      user,
    });
    return this.invoiceRepository.save(invoice);
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find();
  }

  async findOne(id: number): Promise<Invoice> {
    return this.invoiceRepository.findOneBy({ invoice_id: id });
  }

  async update(invoiceId: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.invoiceRepository.preload({
      invoice_id: invoiceId,
      ...updateInvoiceDto,
    });
    if (!invoice) {
      throw new Error(`Invoice with id ${invoiceId} not found`);
    }
    return this.invoiceRepository.save(invoice);
  }
}
