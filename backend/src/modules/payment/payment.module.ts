import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from '../invoice/entity/invoice.entity';
import { Users } from '../users/entity/users.entity';
import { Subscription } from '../subscription/entity/subscription.entity';

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
