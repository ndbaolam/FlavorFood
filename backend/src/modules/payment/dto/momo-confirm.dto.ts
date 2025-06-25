// dto/momo-confirm.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class MomoConfirmDto {
  @ApiProperty({
    description: 'Mã đơn hàng',
    example: '1234567890',
    required: true,
  })
  orderId: string;

  @ApiProperty(
    {
      description: 'ID duy nhất cho mỗi request',
      example: '0987654321',
      required: true,
    }
  )
  requestId: string;

  @ApiProperty(
    {
      description: 'Số tiền hóa đơn gốc',
      example: '1234567890',
      required: true,
    }
  )
  amount: number;
}
