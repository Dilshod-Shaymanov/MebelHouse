import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDetailDto {
  @ApiProperty({
    example: '1 dona',
    description: 'Sotuv to‘plami tarkibi',
  })
  @IsString()
  @IsNotEmpty()
  sales_package: string;

  @ApiProperty({
    example: 'XYZ123',
    description: 'Model raqami',
  })
  @IsString()
  @IsNotEmpty()
  model_number: string;

  @ApiProperty({
    example: 'Metall',
    description: 'Ikkinchi darajali material',
  })
  @IsString()
  @IsNotEmpty()
  secondary_material: string;

  @ApiProperty({
    example: 'Modulli',
    description: 'Konfiguratsiya turi',
  })
  @IsString()
  @IsNotEmpty()
  configuration: string;

  @ApiProperty({
    example: 'Charm',
    description: 'Ustki qoplama materiali',
  })
  @IsString()
  @IsNotEmpty()
  upholstery_material: string;

  @ApiProperty({
    example: 'Qora',
    description: 'Ustki qoplama rangi',
  })
  @IsString()
  @IsNotEmpty()
  upholstery_color: string;

  @ApiProperty({
    example: 'Ko‘pik',
    description: 'Ichki material',
  })
  @IsString()
  @IsNotEmpty()
  filling_material: string;

  @ApiProperty({
    example: 'Yorqin',
    description: 'Tugatish turi',
  })
  @IsString()
  @IsNotEmpty()
  finish_type: string;

  @ApiProperty({
    example: 'Ha',
    description: 'Bosh tayanchi moslashtiriladimi',
  })
  @IsString()
  @IsNotEmpty()
  adjustable_headrest: string;

  @ApiProperty({
    example: '120 kg',
    description: 'Maksimal yuk sig‘imi',
  })
  @IsString()
  @IsNotEmpty()
  maximum_load_capacity: string;

  @ApiProperty({
    example: 'Hindiston',
    description: 'Ishlab chiqarilgan mamlakat',
  })
  @IsString()
  @IsNotEmpty()
  origin_of_manufacture: string;

  @ApiProperty({
    example: '200 sm',
    description: 'Kengligi',
  })
  @IsString()
  @IsNotEmpty()
  width: string;

  @ApiProperty({
    example: '100 sm',
    description: 'Balandligi',
  })
  @IsString()
  @IsNotEmpty()
  height: string;

  @ApiProperty({
    example: '90 sm',
    description: 'Chuqurligi',
  })
  @IsString()
  @IsNotEmpty()
  depth: string;

  @ApiProperty({
    example: '50 kg',
    description: 'Og‘irligi',
  })
  @IsString()
  @IsNotEmpty()
  weight: string;

  @ApiProperty({
    example: '45 sm',
    description: 'O‘rindiq balandligi',
  })
  @IsString()
  @IsNotEmpty()
  seat_height: string;

  @ApiProperty({
    example: '10 sm',
    description: 'Oyoq balandligi',
  })
  @IsString()
  @IsNotEmpty()
  leg_height: string;

  @ApiProperty({
    example: '1 yil',
    description: 'Kafolat xulosasi',
  })
  @IsString()
  @IsNotEmpty()
  warranty_summary: string;

  @ApiProperty({
    example: 'Saytga murojaat qiling',
    description: 'Kafolat xizmati turi',
  })
  @IsString()
  @IsNotEmpty()
  warranty_service_type: string;

  @ApiProperty({
    example: 'Ishlab chiqarishdagi nuqsonlar',
    description: 'Kafolatga kiruvchi holatlar',
  })
  @IsString()
  @IsNotEmpty()
  covered_in_warranty: string;

  @ApiProperty({
    example: 'Foydalanuvchi tomonidan zarar yetkazilgan holatlar',
    description: 'Kafolatga kirmaydigan holatlar',
  })
  @IsString()
  @IsNotEmpty()
  not_covered_in_warranty: string;

  @ApiProperty({
    example: '1 yil',
    description: 'Ichki kafolat muddati',
  })
  @IsString()
  @IsNotEmpty()
  domestic_warranty: string;

  @ApiProperty({
    example: 1,
    description: 'Product unikal identifikatori',
  })
  @IsNumber()
  productId: number;
}
