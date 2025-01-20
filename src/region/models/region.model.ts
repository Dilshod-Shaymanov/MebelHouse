import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Address } from 'src/addresses/models/address.model';
import { District } from 'src/district/models/district.model';

interface IRegionAttr {
  name: string;
}

@Table({ tableName: 'region' })
export class Region extends Model<Region, IRegionAttr> {
  @ApiProperty({ example: 1, description: 'Region ID' })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: 'New York', description: 'Region Name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @HasMany(() => Address)
  addresses: Address[];

  @HasMany(() => District)
  districts: District[];
}
