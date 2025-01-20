import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateOrderItemDto {
  @ApiProperty({ example: 1, description: "Enter order's ID" })
  @IsNumber()
  orderId: number;

  @ApiProperty({ example: 1, description: "Enter product's ID" })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 10, description: 'Enter quantity of order items' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 10000, description: 'Enter price of order items' })
  @IsNumber()
  price: number;
}
