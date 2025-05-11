import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request, Response } from 'express';
import { MomoConfirmDto } from './dto/momo-confirm.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('momo')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create URL payment via MoMo' })
  @ApiQuery({ name: 'orderId', required: true, type: String })
  @ApiQuery({ name: 'amount', required: true, type: Number })
  async createPayment(
    @Req() req: Request,
    @Query('orderId') orderId: string,
    @Query('amount') amount: number
  ) {
    try {
      const result = await this.paymentService.createMomoPayment(
        orderId,
        amount,
        req
      );
      return result;
    } catch (error) {
      Logger.error('Error creating MoMo payment', error);
      throw new Error('Failed to create MoMo payment');
    }
  }

  @Get('momo-return')
  @ApiOperation({ summary: 'Xử lý redirect từ MoMo (returnUrl)' })
  momoReturn(@Query() query: any, @Req() req: Request) {
    try {
      const success = query.resultCode === '0';

      if(success) {
        this.paymentService.handleMomoReturn(req, query);

        return {
          message: 'Thanh toán thành công',
          data: query,
        };
      } else {
        return {
          message: 'Thanh toán thất bại',
          data: query,
        };
      }      
    } catch (error) {
      Logger.error('Error creating MoMo payment', error);
      throw new Error('Failed to return MoMo payment');
    }    
  }

  @Post('momo-notify')
  @ApiOperation({ summary: 'Xử lý webhook từ MoMo (notifyUrl)' })
  async momoNotify(@Body() payload: any, @Res() res: Response) {
    try {
      await this.paymentService.handleMomoNotification(payload);
      return { message: 'Notification received' };
    } catch (error) {
      Logger.error(error);
      return res.status(400).json({ message: 'Error processing payment' });
    }
  }

  @Post('momo-confirm')
  @ApiOperation({ summary: 'Confirm Momo payment' })
  async confirmPayment(
    @Query() query: MomoConfirmDto,
  ) {
    try {
      const result = await this.paymentService.confirmMomoTransaction(
        query.orderId,
        query.requestId,
        query.amount,
      );
  
      return result;
    } catch (error) {
      Logger.error('Error confirming MoMo payment', error);
      throw new Error('Failed to confirm MoMo payment');
    }    
  }
}
