import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { Invoice } from './entity/invoice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
  imports: [TypeOrmModule.forFeature([Invoice, Users])],
})
export class InvoiceModule {}
