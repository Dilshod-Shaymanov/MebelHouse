import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'admin@Gmail.com',
    description: 'Email for signing in',
  })
  @IsNotEmpty({ message: 'Email field is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be valid' })
  readonly email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for authentication',
  })
  @IsNotEmpty({ message: 'Password field is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  readonly password: string;
}
