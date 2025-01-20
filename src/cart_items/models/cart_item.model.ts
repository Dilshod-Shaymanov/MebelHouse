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
import { Cart } from '../../cart/models/cart.model';
import { Product } from '../../product/models/product.model';
interface ICartItemsAttr {
  clientId: number;
  createdAt: string;
}

@Table({ tableName: 'cart_items' })
export class CartItems extends Model<CartItems, ICartItemsAttr> {
  @ApiProperty({ example: 1, description: 'Unique Cart ID' })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'Cart ID',
  })
  @ForeignKey(() => Cart)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  cartId: number;
  @BelongsTo(() => Cart)
  cart: Cart;

  @ApiProperty({
    example: 1,
    description: 'Product ID',
  })
  @ForeignKey(() => Product)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  productId: number;
  @BelongsTo(() => Product)
  product: Product;

  @ApiProperty({
    example: 1,
    description: 'Quantity cart items',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;
}
