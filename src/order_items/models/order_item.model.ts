import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from 'src/order/models/order.model';
import { Product } from '../../product/models/product.model';

interface IOrderItemsCreationAttr {
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

@Table({ tableName: 'order_items' })
export class OrderItems extends Model<OrderItems, IOrderItemsCreationAttr> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  orderId: number;
  @BelongsTo(() => Order)
  orders: Order;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  productId: number;
  @BelongsTo(() => Product)
  product: Product;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  quantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  price: number;
}
