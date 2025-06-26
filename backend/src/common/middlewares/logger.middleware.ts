import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const ip =
      req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusColor =
        res.statusCode >= 500
          ? chalk.red
          : res.statusCode >= 400
            ? chalk.yellow
            : res.statusCode >= 300
              ? chalk.cyan
              : chalk.green;

      this.logger.log(
        `${chalk.blueBright(`[${method}]`)} ${chalk.whiteBright(originalUrl)} | ` +
          `Status: ${statusColor(res.statusCode.toString())} | ` +
          `Time: ${chalk.magenta(duration + 'ms')} | ` +
          `IP: ${chalk.gray(ip)} | UA: ${chalk.dim(userAgent ?? '')}`,
      );
    });

    next();
  }
}
