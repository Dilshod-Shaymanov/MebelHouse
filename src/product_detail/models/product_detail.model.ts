import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../product/models/product.model';

interface ICreationAttr {
  sales_package: string;
  model_number: string;
  secondary_material: string;
  configuration: string;
  upholstery_material: string;
  upholstery_color: string;
  filling_material: string;
  finish_type: string;
  adjustable_headrest: string;
  maximum_load_capacity: string;
  origin_of_manufacture: string;
  width: string;
  height: string;
  depth: string;
  weight: string;
  seat_height: string;
  leg_height: string;
  warranty_summary: string;
  warranty_service_type: string;
  covered_in_warranty: string;
  not_covered_in_warranty: string;
  domestic_warranty: string;
  productId: number;
}

@Table({ tableName: 'product_details' })
export class ProductDetail extends Model<ProductDetail, ICreationAttr> {
  @ApiProperty({
    example: 1,
    description: 'Mahsulot tafsilotlari ID raqami',
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    example: '1 dona',
    description: 'Sotuv to‘plami tarkibi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sales_package: string;

  @ApiProperty({
    example: 'XYZ123',
    description: 'Model raqami',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  model_number: string;

  @ApiProperty({
    example: 'Metall',
    description: 'Ikkinchi darajali material',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  secondary_material: string;

  @ApiProperty({
    example: 'Modulli',
    description: 'Konfiguratsiya turi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  configuration: string;

  @ApiProperty({
    example: 'Charm',
    description: 'Ustki qoplama materiali',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  upholstery_material: string;

  @ApiProperty({
    example: 'Qora',
    description: 'Ustki qoplama rangi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  upholstery_color: string;

  @ApiProperty({
    example: 'Ko‘pik',
    description: 'Ichki material',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  filling_material: string;

  @ApiProperty({
    example: 'Yorqin',
    description: 'Tugatish turi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  finish_type: string;

  @ApiProperty({
    example: 'Ha',
    description: 'Bosh tayanchi moslashtiriladimi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  adjustable_headrest: string;

  @ApiProperty({
    example: '120 kg',
    description: 'Maksimal yuk sig‘imi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  maximum_load_capacity: string;

  @ApiProperty({
    example: 'Hindiston',
    description: 'Ishlab chiqarilgan mamlakat',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  origin_of_manufacture: string;

  @ApiProperty({
    example: '200 sm',
    description: 'Kengligi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  width: string;

  @ApiProperty({
    example: '100 sm',
    description: 'Balandligi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  height: string;

  @ApiProperty({
    example: '90 sm',
    description: 'Chuqurligi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  depth: string;

  @ApiProperty({
    example: '50 kg',
    description: 'Og‘irligi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  weight: string;

  @ApiProperty({
    example: '45 sm',
    description: 'O‘rindiq balandligi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  seat_height: string;

  @ApiProperty({
    example: '10 sm',
    description: 'Oyoq balandligi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  leg_height: string;

  @ApiProperty({
    example: '1 yil',
    description: 'Kafolat xulosasi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  warranty_summary: string;

  @ApiProperty({
    example: 'Saytga murojaat qiling',
    description: 'Kafolat xizmati turi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  warranty_service_type: string;

  @ApiProperty({
    example: 'Ishlab chiqarishdagi nuqsonlar',
    description: 'Kafolatga kiruvchi holatlar',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  covered_in_warranty: string;

  @ApiProperty({
    example: 'Foydalanuvchi tomonidan zarar yetkazilgan holatlar',
    description: 'Kafolatga kirmaydigan holatlar',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  not_covered_in_warranty: string;

  @ApiProperty({
    example: '1 yil',
    description: 'Ichki kafolat muddati',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  domestic_warranty: string;

  //

  @ApiProperty({
    example: 1,
    description: 'Product unikal identifikatori',
  })
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  //

  @BelongsTo(() => Product)
  product: Product;

  //
}
