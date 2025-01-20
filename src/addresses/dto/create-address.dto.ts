import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateAddressDto {
  @ApiProperty({ example: 1, description: 'Client ID' })
  @IsNotEmpty({ message: 'Client ID' })
  @IsNumber({}, { message: 'Car ID must be a number' })
  clientId: number;

  @ApiProperty({ example: "123 Main St", description: 'Street' })
  @IsNotEmpty({ message: 'Street' })
  @IsString({ message: 'Street must be a string' })
  street: string;

  @ApiProperty({ example: 1, description: 'Region ID' })
  @IsNotEmpty({ message: 'Region ID' })
  @IsNumber({}, { message: 'Region ID must be a number' })
  regionId: number;

  @ApiProperty({ example: "New York", description: 'State' })
  @IsNotEmpty({ message: 'State' })
  @IsString({ message: 'State must be a string' })
  state: string;

  @ApiProperty({ example: "10001", description: 'Zip Code' })
  @IsNotEmpty({ message: 'Zip Code' })
  @IsString({ message: 'Zip Code must be a string' })
  zipCode: string;

  @ApiProperty({ example: "USA", description: 'Country' })
  @IsNotEmpty({ message: 'Country' })
  @IsString({ message: 'Country must be a string' })
  country: string;
}
