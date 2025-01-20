import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsEmail,
  Length,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: "Client's full name",
    example: 'Sardor Sobidjonov',
  })
  @IsString({ message: 'Full name must be a string' })
  @Length(3, 50, {
    message: 'Full name length must be between 3 and 50 characters',
  })
  full_name: string;

  @ApiProperty({
    description: "Client's phone number",
    example: '+998901234567',
  })
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^\+998[0-9]{9}$/, {
    message: 'Phone number must match the Uzbekistan format (+998901234567)',
  })
  phone_number: string;

  @ApiProperty({
    description: "Client's email address",
    example: 'Client@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email address format' })
  @Length(5, 100, {
    message: 'Email length must be between 5 and 100 characters',
  })
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'P@ssw0rd',
  })
  @IsString({ message: 'Password must be a string' })
  @Length(8, 100, {
    message: 'Password length must be at least 8 characters',
  })
  password: string;

  @ApiProperty({
    description: 'Confirm Password',
    example: 'P@ssw0rd',
  })
  @IsString({ message: 'Confirm password must be a string' })
  @Length(8, 100, {
    message: 'Confirm password length must be at least 8 characters',
  })
  confirm_password: string;
}
