import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Request, Response } from 'express';
import { ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly sseService: NotificationsService) {}

  @Get('stream')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Connect to SSE stream (user-specific)' })
  sse(@Req() req: Request, @Res() res: Response) {
    const userId = req['sub'];

    if (!userId) {
      res.status(401).end();
      return;
    }

    this.sseService.addClient(userId, res);

    req.on('close', () => {
      this.sseService.removeClient(userId);
    });
  }
}
