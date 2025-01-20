import { Timestamp } from 'rxjs';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from 'src/order/models/order.model';

export enum PaymentMethod {
  CARD = 'card',
  CASH = 'cash',
}

export enum PaymentStatus {
  NOTPAID = 'notpaid',
  PAID = 'paid',
}

export interface IPaymentCreationAttr {
  orderId: number;
  method: PaymentMethod;
  date: Date;
  status: PaymentStatus;
}

@Table({ tableName: 'payment' })
export class Payment extends Model<Payment, IPaymentCreationAttr> {
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

  @Column({
    type: DataType.ENUM,
    values: Object.values(PaymentMethod), // Enumning qiymatlarini beradi
    allowNull: false,
    defaultValue: PaymentMethod.CASH, // Standart qiymat
  })
  method: PaymentMethod;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  date: Date;

  @Column({
    type: DataType.ENUM,
    values: Object.values(PaymentStatus), // Enumning qiymatlarini beradi
    allowNull: false,
    defaultValue: PaymentStatus.NOTPAID, // Standart qiymat
  })
  status: PaymentStatus;
}
