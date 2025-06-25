import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { InvoiceStatus } from "../entity/invoice.entity";

export class CreateInvoiceDto {  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title of the invoice',
    example: 'Invoice for service subscription',
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the invoice',
    example: 'This invoice is for the subscription of service XYZ',
    required: false,
  })
  description?: string;

  @IsEnum(InvoiceStatus)
  @IsNotEmpty()
  @ApiProperty({
    enum: InvoiceStatus,
    enumName: 'InvoiceStatus',
    description: 'Status of the invoice',
    example: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Title of the invoice',
    example: 'Invoice for service subscription',
  })
  title?: string;
}