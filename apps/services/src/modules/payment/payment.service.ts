import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { MomoConfig } from './momo.interface';
import { UserRole, Users } from '../users/entity/users.entity';
import { Invoice, InvoiceStatus } from '../invoice/entity/invoice.entity';
import { Subscription } from '../subscription/entity/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PaymentService {
  private momoConfig: MomoConfig;

  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,

    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,    

    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
  ) {
    this.momoConfig = this.configService.get<MomoConfig>('momo');
  }

  async createMomoPayment(orderId: string, amount: number, req?: Request) {
    const requestId = `${orderId}-${Date.now()}`;
    const orderInfo = 'Thanh toán gói đăng ký dịch vụ';
    const config = this.momoConfig;

    const rawSignature = `accessKey=${config.accessKey}&amount=${amount}&extraData=&ipnUrl=${config.notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${config.partnerCode}&redirectUrl=${config.redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

    const signature = crypto
      .createHmac('sha256', config.secretKey)
      .update(rawSignature)
      .digest('hex');

    const user = await this.userService.getUserById(req['sub']);

    const userInfo = {
      name: user.last_name + user.first_name,
      email: user.mail,
    };

    const body = {
      partnerCode: config.partnerCode,
      accessKey: config.accessKey,
      requestId,
      amount: amount.toString(),
      orderId,
      orderInfo,
      userInfo,
      redirectUrl: config.redirectUrl,
      ipnUrl: config.notifyUrl,
      extraData: '',
      requestType: 'captureWallet',
      signature,
      lang: 'vi',
    };

    const response = await axios.post(config.endpoint, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  }

  async confirmMomoTransaction(orderId: string, requestId: string, amount: number) {
    const config = this.momoConfig;
    
    const accessKey = config.accessKey;
    const secretKey = config.secretKey;
    const partnerCode = config.partnerCode;
    const requestType = 'capture';
    const description = 'Xác nhận giao dịch';
    const lang = 'vi';
  
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&description=${description}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}&requestType=${requestType}`;
  
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
  
    const body = {
      partnerCode,
      requestId,
      orderId,
      requestType,
      amount,
      lang,
      description,
      signature,
    };
  
    const response = await axios.post(`${config.confirmEndpoint}`, body, {
      headers: { 'Content-Type': 'application/json' },
    });
  
    return response.data;
  }  
  
  async handleMomoNotification(payload: any) {    
    return payload
  }

  async handleMomoReturn(req: Request, query: any) {    
    try {
      const userId = req['user']['sub'];
      //orderId: order_id_timestamp
      const subscriptionId = query.orderId.split("_")[1]; 

      const user = await this.userService.getUserById(userId);

      const subscription = await this.subscriptionRepo.findOne({
        where: { subscription_id: subscriptionId },
      });

      if (!user || !subscription) {
        throw new Error('User or Subscription not found');
      }

      const momoStatus = query.resultCode;

      if (momoStatus !== '0') {
        await this.invoiceRepo.save({
          title: `Invoice for ${subscription.title}`,
          description: subscription.description,
          status: InvoiceStatus.FAILED,
          user,
          subscription,
        });

        throw new Error('Payment failed or cancelled');
      }

      //Begin transaction
      try {
        return await this.dataSource.transaction(async (manager) => {        
          const invoice = manager.create(Invoice, {
            title: `Invoice for ${subscription.title}`,
            description: subscription.description,
            status: InvoiceStatus.COMPLETED,
            user,
            subscription,
          });

          await manager.save(invoice);
          
          await manager.update('users', { user_id: userId }, { role: UserRole.SELLER });

          return {
            message: 'Payment successful and invoice created',
            invoice,
          };
        });
      } catch (error) {
        throw new Error('Payment failed. If you have paid, please contact Admin to get a refund!');
      }   
    } catch (error) {
      throw new Error('Payment failed. If you have paid, please contact Admin to get a refund!');
    }       
  }
}
