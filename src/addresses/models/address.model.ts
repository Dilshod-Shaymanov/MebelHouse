import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Client } from "src/client/models/client.model";
import { Region } from "src/region/models/region.model";


interface IAddreeAttr{
    clientId: number;
    street: string;
    regionId: number;
    state: string;
    zipCode: string;
    country: string;
}

@Table({ tableName: "address"})
export class Address extends Model<Address,IAddreeAttr>{
    @ApiProperty({example: 1, description: "Address"})
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @ApiProperty({example: 1, description: "Client"})
    @ForeignKey(()=> Client)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    clientId: number;
    @BelongsTo(()=> Client)
    client: Client;

    @ApiProperty({example: "123 Main St", description: "Street"})
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    street: string;

    @ApiProperty({example: 12345, description: "House number"})
    @ForeignKey(()=> Region)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    regionId: number;
    @BelongsTo(()=> Region)
    region: Region;

    @ApiProperty({example: "New York", description: "Region"})
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    state: string;

    @ApiProperty({example: "NY", description: "Zip code"})
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    zipCode: string;

    @ApiProperty({example: "USA", description: "Country"})
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    country: string;
}
