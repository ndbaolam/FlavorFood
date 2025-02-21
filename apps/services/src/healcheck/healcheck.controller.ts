import { Controller, Get } from '@nestjs/common';

@Controller('healcheck')
export class HealcheckController {
  @Get()
  healthCheck() {
    return { status: 'UP' };
  }
}
