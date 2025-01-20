import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Mahsulotning nomi',
    example: 'Mebel',
  })
  @IsNotEmpty({ message: "Mahsulot nomi bo'sh bo'lmasligi kerak" })
  @IsString({ message: "Mahsulot nomi matn bo'lishi kerak" })
  name: string;

  @ApiProperty({
    description: 'Mahsulotning narxi',
    example: 500,
  })
  @IsNotEmpty({ message: 'Narx bo‘sh bo‘lmasligi kerak' })
  @IsNumber({}, { message: 'Narx raqam bo‘lishi kerak' })
  @IsPositive({ message: 'Narx musbat raqam bo‘lishi kerak' })
  price: number;

  @ApiProperty({
    description: 'Chegirma foizda (%), 0 dan 100 gacha',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Chegirma foiz raqam bo‘lishi kerak' })
  @Min(0, { message: 'Chegirma 0 dan kichik bo‘lmasligi kerak' })
  @Max(100, { message: 'Chegirma 100 dan katta bo‘lmasligi kerak' })
  discount: number;

  @ApiProperty({
    description: 'Mahsulotning tavsifi',
    example: 'Yotsangiz yumshoqlikni his qilasz',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Tavsif matn bo‘lishi kerak' })
  description: string;

  @ApiProperty({
    example: 1,
    description: 'Category unikal identifikatori',
  })
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    example: 1,
    description: 'Maxsulot soni',
  })
  @IsNumber()
  stock:number;

  @IsOptional()
  avg_rating?: number;
}
