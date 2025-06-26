import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  UseGuards,
  Req,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { Invoice, InvoiceStatus } from './entity/invoice.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

@ApiTags('Invoice')
@Controller('invoice')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created', type: Invoice })
  async create(
    @Req() req: Request,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<Invoice> {
    const user = req['user'];

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.invoiceService.create(Number(user['sub']), createInvoiceDto);
  }

  @Get()
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: InvoiceStatus,
  })
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({ status: 200, type: [Invoice] })
  async findAll(
    @Query('userId') userId: string | null = null,
    @Query('status') status: InvoiceStatus | null = null,
  ): Promise<Invoice[]> {
    return this.invoiceService.findAll(Number(userId), status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific invoice by ID' })
  @ApiResponse({ status: 200, type: Invoice })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Invoice> {
    return this.invoiceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing invoice' })
  @ApiResponse({ status: 200, description: 'Invoice updated', type: Invoice })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoiceService.update(id, updateInvoiceDto);
  }
}
