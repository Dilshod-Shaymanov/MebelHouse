import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../models/order.model';

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: "Enter client's ID" })
  @IsNumber()
  clientId: number;

  @ApiProperty({
    example: 'PENDING',
    description: 'Enter status of the order',
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus, { message: 'Status must be a valid OrderStatus value' })
  status: OrderStatus;

  @ApiProperty({
    example: '2024-02-02',
    description: 'Enter deadline of order',
  })
  shipping_date: Date;

  @ApiProperty({ example: 990000, description: 'Enter total price of order' })
  @IsNumber()
  total_price: number;
}
