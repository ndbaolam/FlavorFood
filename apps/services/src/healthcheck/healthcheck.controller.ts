import { Controller, Get } from '@nestjs/common';

@Controller('healcheck')
export class HealthcheckController {
  @Get()
  healthCheck() {
    return { status: 'UP' };
  }
}
