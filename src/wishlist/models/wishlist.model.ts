import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../../client/models/client.model';
import { Product } from '../../product/models/product.model';

@Table({ tableName: 'wishlist' })
export class Wishlist extends Model<Wishlist> {
  @ApiProperty({ example: 1, description: 'Unique Like ID' })
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: 1, description: 'Client ID who liked the product post' })
  @ForeignKey(() => Client)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  clientId: number;
  @BelongsTo(() => Client)
  client: Client;

  @ApiProperty({ example: 1, description: 'Product ID liked by the client' })
  @ForeignKey(() => Product)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  productId: number;
  @BelongsTo(() => Product)
  product: Product;
}
