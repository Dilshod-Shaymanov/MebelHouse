import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Wishlist } from '../../wishlist/models/wishlist.model';
import { Review } from '../../reviews/models/review.model';
import { Order } from '../../order/models/order.model';
import { Cart } from '../../cart/models/cart.model';
import { Address } from 'src/addresses/models/address.model';

interface IClientAttr {
  full_name: string;
  phone_number: string;
  email: string;
  is_active: boolean;
  hashed_password: string;
  hashed_refresh_token: string;
}

@Table({ tableName: 'clients' })
export class Client extends Model<Client, IClientAttr> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Sardor Sobidjonov',
    description: "Client's full name",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @ApiProperty({
    example: '+998901234567',
    description: "Client's phone number",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone_number: string;

  @ApiProperty({
    example: 'Client@gmail.com',
    description: "Client's email address",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the Client is active',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_active: boolean;

  @ApiProperty({
    example: '$2b$10$abcdefghijklmnopqrstuv',
    description: 'Hashed password',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @ApiProperty({
    example: '$2b$10$qrstuvwxyzabcdefghi',
    description: 'Hashed refresh token',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  hashed_refresh_token: string;

  @HasMany(() => Wishlist)
  wishlists: Wishlist[];

  @HasMany(() => Review)
  reviews: Review[];

  @HasMany(() => Order)
  orders: Order[];

  @HasMany(() => Cart)
  carts: Cart[];

  @HasMany(() => Address)
  addresses: Address[];
}
