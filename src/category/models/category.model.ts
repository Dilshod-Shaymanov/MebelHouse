import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../product/models/product.model';

interface ICreationCategoryAttr {
  name: string;
  description: string;
}

@Table({ tableName: 'category' })
export class Category extends Model<Category, ICreationCategoryAttr> {
  @ApiProperty({
    example: 1,
    description: 'Kategoriya ID raqami',
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    example: 'Qurilmalar',
    description: 'Kategoriya nomi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 'Qurilmalar va gadjetlar',
    description: 'Kategoriya tavsifi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @HasMany(() => Product)
  product: Product[];
}
