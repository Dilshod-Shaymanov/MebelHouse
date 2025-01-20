import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsEmail, Length, Matches } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Full Name of admin',
    example: 'Sardor Sobidjonov',
  })
  @IsString({ message: 'Full name must be a string' })
  @Length(3, 50, {
    message: 'Full name length must be between 3 and 50 characters',
  })
  full_name: string;

  @ApiProperty({
    description: 'Email address of admin',
    example: 'admin@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email address format' })
  @Length(5, 100, {
    message: 'Email length must be between 5 and 100 characters',
  })
  email: string;

  @ApiProperty({
    description: 'Admin phone number',
    example: '+998901234567',
  })
  @Matches(/^\+998[0-9]{9}$/, {
    message: 'Invalid phone number format. Correct format: +998XXXXXXXXX',
  })
  phone_number: string;

  @ApiProperty({ description: 'Password', example: 'P@ssw0rd' })
  @IsString({ message: 'Password must be a string' })
  @Length(8, 100, {
    message: 'Password length must be at least 8 characters',
  })
  password: string;

  @ApiProperty({ description: 'Confirm Password', example: 'P@ssw0rd' })
  @IsString({ message: 'Confirm password must be a string' })
  @Length(8, 100, {
    message: 'Confirm password length must be at least 8 characters',
  })
  confirm_password: string;

  // @ApiProperty({ description: 'Admin active status', default: true })
  // @IsBoolean({ message: "Active status must be 'true' or 'false'" })
  // is_active?: boolean;
  is_creator?: boolean;
}
