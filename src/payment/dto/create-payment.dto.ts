import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../models/payment.model';

export class CreatePaymentDto {
  @ApiProperty({ example: 1, description: "Enter order's ID" })
  @IsNumber()
  orderId: number;

  @ApiProperty({
    example: 'card',
    description: 'Enter method of the payment',
    enum: PaymentMethod,
  })
  @IsEnum(PaymentMethod, {
    message: 'Method must be a valid PaymentMethod value',
  })
  method: PaymentMethod;

  @ApiProperty({
    example: '2024-02-02',
    description: 'Enter date of payment',
  })
  date: Date;

  @ApiProperty({
    example: 'notpaid',
    description: 'Enter status of the payment',
    enum: PaymentStatus,
  })
  @IsEnum(PaymentStatus, {
    message: 'Status must be a valid PaymentMethod value',
  })
  status: PaymentStatus;
}
