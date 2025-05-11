import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { MomoConfig } from './momo.interface';
import { UserRole } from '../users/entity/users.entity';

@Injectable()
export class PaymentService {
  private momoConfig: MomoConfig;

  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
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
    console.log(payload)
  }

  async handleMomoReturn(req: Request, query: any) {    
    const userId = req['sub'];
    const newExpDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days 
    
    await this.userService.updateUser(userId, {
      role: UserRole.SELLER,
      exp_date: newExpDate
    })
  }
}
