import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class NotificationsService {
  private clients: Map<number, Response> = new Map();

  addClient(userId: number, res: Response) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    this.clients.set(userId, res);
    res.write(`data: ${JSON.stringify({ message: 'SSE connected' })}\n\n`);
  }

  removeClient(userId: number) {
    const client = this.clients.get(userId);
    if (client) {
      client.end();
      this.clients.delete(userId);
    }
  }

  sendToUser(userId: number, data: any) {
    const client = this.clients.get(userId);
    if (client) {
      client.write(`data: ${JSON.stringify(data)}\r\n`);
    }
  }

  broadcast(data: any) {
    for (const [, res] of this.clients.entries()) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }
}
