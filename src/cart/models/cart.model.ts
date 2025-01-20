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
import { CartItems } from '../../cart_items/models/cart_item.model';
interface ICartAttr {
  clientId: number;
  createdAt: string;
}

@Table({ tableName: 'carts' })
export class Cart extends Model<Cart, ICartAttr> {
  @ApiProperty({ example: 1, description: 'Unique Cart ID' })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'Client ID who cart the product post',
  })
  @ForeignKey(() => Client)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  clientId: number;
  @BelongsTo(() => Client)
  client: Client;

  @ApiProperty({
    example: '2022-01-01T10:00:00.000Z',
    description: 'cart creation date',
  })
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: string;

  @HasMany(()=> CartItems)
  cart_items: CartItems
}
