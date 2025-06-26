import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from './entity/invoice.entity';
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

  async create(
    userId: number,
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<Invoice> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      user,
    });
    return this.invoiceRepository.save(invoice);
  }
  async findAll(userId?: number, status?: InvoiceStatus): Promise<Invoice[]> {
    try {
      const query = this.invoiceRepository
        .createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.user', 'user')
        .leftJoinAndSelect('invoice.subscription', 'subscription');

      if (userId) {
        query.where('invoice.user_id = :userId', { userId });
      }

      if (status) {
        query.andWhere('invoice.status = :status', { status });
      }

      query.orderBy('invoice.created_at', 'DESC');

      const invoices = await query.getMany();
      const now = new Date();

      for (const invoice of invoices) {
        if (
          invoice.status === InvoiceStatus.COMPLETED &&
          invoice.created_at &&
          invoice.subscription?.day_remain
        ) {
          const createdAt = new Date(invoice.created_at);
          const expiredAt = new Date(createdAt);
          expiredAt.setDate(
            createdAt.getDate() + invoice.subscription.day_remain,
          );

          if (expiredAt < now) {
            invoice.status = InvoiceStatus.EXPIRED;
            await this.invoiceRepository.save(invoice);
          }
        }
      }

      return invoices;
    } catch (error) {
      console.error('Error in findAll method:', error);
      throw new NotFoundException('Invoices not found');
    }
  }

  async findOne(id: number): Promise<Invoice> {
    return this.invoiceRepository.findOneBy({ invoice_id: id });
  }

  async update(
    invoiceId: number,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
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
