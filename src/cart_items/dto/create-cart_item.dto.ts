import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({
    example: 1,
    description: 'Cart ID',
  })
  @IsNotEmpty({ message: "Cart ID bo'sh bo'lmasligi kerak" })
  @IsNumber({}, { message: "Cart ID raqam bo'lishi kerak" })
  cartId: number;

  @ApiProperty({
    example: 1,
    description: 'Product ID',
  })
  @IsNotEmpty({ message: "Product ID bo'sh bo'lmasligi kerak" })
  @IsNumber({}, { message: "Product ID raqam bo'lishi kerak" })
  productId: number;

  @ApiProperty({
    example: 1,
    description: 'Quantity',
  })
  @IsNumber({}, { message: "Quantity raqam bo'lishi kerak" })
  quantity: number;
}
