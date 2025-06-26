import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Healthcheck')
@Controller('healcheck')
export class HealthcheckController {
  @Get()
  @ApiOperation({ summary: 'Check service health status' })
  @ApiResponse({
    status: 200,
    description: 'Service is up',
    schema: {
      example: {
        status: 'UP',
      },
    },
  })
  healthCheck() {
    return { status: 'UP' };
  }
}
