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

interface ICreationImageAttr {
  image: string[];
  productId: number;
}

@Table({ tableName: 'images' })
export class Image extends Model<Image, ICreationImageAttr> {
  @ApiProperty({
    example: 1,
    description: 'Rasm ID raqami',
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Rasm URL manzillari',
  })
  @Column(DataType.ARRAY(DataType.STRING))
  image: string[];

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

  @BelongsTo(() => Product)
  product: Product;
}
