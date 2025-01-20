import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Client } from '../../client/models/client.model';
import { Product } from '../../product/models/product.model';
interface IReviewAttr {
  clientId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  createdTime: string;
}

@Table({ tableName: 'reviews' })
export class Review extends Model<Review, IReviewAttr> {
  @ApiProperty({ example: 1, description: 'Unique review ID' })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'Client ID who reviewed the product post',
  })
  @ForeignKey(() => Client)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  clientId: number;
  @BelongsTo(() => Client)
  client: Client;

  @ApiProperty({ example: 1, description: 'Product ID reviewed by the client' })
  @ForeignKey(() => Product)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  productId: number;
  @BelongsTo(() => Product)
  product: Product;

  @ApiProperty({ example: 5, description: 'Rating of the product from 1 to 5' })
  @Column({
    type: DataType.INTEGER,
  })
  rating?: number;

  @ApiProperty({
    example: 'Great product!',
    description: 'Client review comment',
  })
  @Column({
    type: DataType.STRING,
  })
  comment?: string;

  @ApiProperty({ example: '2022-01-01', description: 'Review creation date' })
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt?: string;

  @ApiProperty({ example: '15:30:56', description: 'Review creation date' })
  @Column({
    type: DataType.TIME,
    defaultValue: DataType.NOW,
  })
  createdTime?: string;
}
