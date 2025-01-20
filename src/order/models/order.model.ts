import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { OrderItems } from 'src/order_items/models/order_item.model';
import { Payment } from 'src/payment/models/payment.model';
import { Client } from '../../client/models/client.model';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  CANCELLED = 'cancelled',
}

interface IOrderCreationAttr {
  clientId: number;
  status: OrderStatus;
  total_price: number;
  shipping_date: Date;
}

@Table({ tableName: 'order' })
export class Order extends Model<Order, IOrderCreationAttr> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  clientId: number;
  @BelongsTo(() => Client)
  client: Client;

  @Column({
    type: DataType.ENUM,
    values: Object.values(OrderStatus), // Enumning qiymatlarini beradi
    allowNull: false,
    defaultValue: OrderStatus.PENDING, // Standart qiymat
  })
  status: OrderStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  total_price: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  shipping_date: Date;

  @HasMany(() => OrderItems)
  order_items: OrderItems[];

  @HasMany(() => Payment)
  payments: Payment[];
}
