import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({
    example: 1,
    description: 'Product ID',
  })
  @IsNotEmpty({ message: "Product ID bo'sh bo'lmasligi kerak" })
  @IsNumber({}, { message: "Product ID raqam bo'lishi kerak" })
  productId: number;

  @ApiProperty({
    example: 1,
    description: 'Client ID',
  })
  @IsNotEmpty({ message: "Client ID bo'sh bo'lmasligi kerak" })
  @IsNumber({}, { message: "Client ID raqam bo'lishi kerak" })
  clientId: number;
}
