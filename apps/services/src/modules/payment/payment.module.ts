import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from '../invoice/entity/invoice.entity';
import { Subscription } from 'rxjs';
import { Users } from '../users/entity/users.entity';

@Module({
  imports: [UsersModule, 
    TypeOrmModule.forFeature([
      Users, 
      Invoice, 
      Subscription
    ])
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
