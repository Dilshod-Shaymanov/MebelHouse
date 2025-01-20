import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";



export class CreateDistrictDto {

    @ApiProperty({ example: "87asdf", description: "Name"})
    @IsNotEmpty({ message: "Name is required" })
    @IsString({ message: "Name must be a string" })
    name: string;

    @ApiProperty({ example: 1, description: "Region ID"})
    @IsNotEmpty({ message: "Region ID is required" })
    @IsNumber({}, { message: "Region ID must be a number" })
    regionId: number;
}
