import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ProductDetail } from '../../product_detail/models/product_detail.model';
import { Category } from '../../category/models/category.model';
import { Image } from '../../images/models/image.model';
import { OrderItems } from '../../order_items/models/order_item.model';
import { CartItems } from '../../cart_items/models/cart_item.model';
import { Review } from '../../reviews/models/review.model';
import { Wishlist } from '../../wishlist/models/wishlist.model';

interface ICreationProductAttr {
  name: string;
  price: number;
  discount: number;
  description: string;
  categoryId: number;
  stock: number;
  avg_rating:number;
}

@Table({ tableName: 'product' })
export class Product extends Model<Product, ICreationProductAttr> {
  @ApiProperty({
    example: 1,
    description: 'Mahsulot ID raqami',
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'Category unikal identifikatori',
  })
  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @ApiProperty({
    description: 'Mahsulotning nomi',
    example: 'Mebel',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    description: 'Mahsulotning narxi',
    example: 500,
  })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;

  @ApiProperty({
    description: 'Chegirma foizda (%), 0 dan 100 gacha',
    example: 10,
    required: false,
  })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  discount: number;

  @ApiProperty({
    description: 'Mahsulotning tavsifi',
    example: 'Yotsangiz yumshoqlikni his qilasz',
    required: false,
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @ApiProperty({
    description: 'Chegirma foizda (%), 0 dan 100 gacha',
    example: 10,
    required: false,
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  stock: number;

  @ApiProperty({
    description: 'Oqilgan mahsulotlar raqami',
    example: 4.5,
    required: false,
  })
  @Column({
    type: DataType.FLOAT,
    defaultValue: 0,
  })
  avg_rating?: number;

  @HasOne(() => ProductDetail)
  productDetail: ProductDetail;

  @HasMany(() => Image)
  images: Image[];

  @HasMany(() => OrderItems)
  orderItems: OrderItems[];

  @HasMany(() => CartItems)
  cartItems: CartItems[];

  @HasMany(() => Review)
  reviews: Review[];

  @HasMany(() => Wishlist)
  wishlists: Wishlist[];
}