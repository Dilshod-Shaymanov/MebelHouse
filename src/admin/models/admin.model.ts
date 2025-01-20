import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IAdminAttr {
  full_name: string;
  phone_number: string;
  email: string;
  hashed_password: string;
  is_active: boolean;
  is_admin: boolean;
  is_creator: boolean;
  hashed_refresh_token: string;
  activation_link: string;
}

@Table({ tableName: 'admin' })
export class Admin extends Model<Admin, IAdminAttr> {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the admin',
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the admin',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @ApiProperty({
    example: '+998-90-123-45-67',
    description: 'Phone number of the admin in the format +998-XX-XXX-XX-XX',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone_number: string;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email address of the admin',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: 'hashed_password_string',
    description: 'Hashed password of the admin',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the admin account is active',
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the user is the creator of the system',
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_creator: boolean;

  @ApiProperty({
    example: 'hashed_refresh_token_string',
    description: 'Hashed refresh token of the admin',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  hashed_refresh_token: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j',
    description: 'Activation link for the admin',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  activation_link: string;
}
