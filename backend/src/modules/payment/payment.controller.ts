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
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request, Response } from 'express';
import { MomoConfirmDto } from './dto/momo-confirm.dto';
import { MomoPaymentQuery } from './momo.interface';
import { ConfigService } from '@nestjs/config';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  @Get('momo')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create URL payment via MoMo' })
  @ApiQuery({ name: 'orderId', required: true, type: String })
  @ApiQuery({ name: 'amount', required: true, type: Number })
  async createPayment(
    @Req() req: Request,
    @Query('orderId') orderId: string,
    @Query('amount', ParseIntPipe) amount: number,
  ) {
    try {
      const result = await this.paymentService.createMomoPayment(
        orderId,
        +amount,
        req,
      );
      return result;
    } catch (error) {
      Logger.error('Error creating MoMo payment', error);
      throw new Error('Failed to create MoMo payment');
    }
  }

  @Get('momo-return')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xử lý redirect từ MoMo (returnUrl)' })
  async momoReturn(
    @Query() query: MomoPaymentQuery,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req['user']['sub'];
      await this.paymentService.handleMomoReturn(Number(userId), query);
      return res.redirect(
        this.configService.get('VITE_CLIENT_URL') +
          `/store-registration?status=success&orderId=${query.orderId}&requestId=${query.requestId}&amount=${query.amount}`,
      );
    } catch (error) {
      Logger.error('Error creating MoMo payment', error);
      return res.redirect(
        this.configService.get('VITE_CLIENT_URL') +
          `/store-registration?status=fail&orderId=${query.orderId}&requestId=${query.requestId}&amount=${query.amount}`,
      );
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
  async confirmPayment(@Query() query: MomoConfirmDto) {
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
