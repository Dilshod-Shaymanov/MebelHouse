import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  Length,
} from 'class-validator';

export class EmailClientDto {
  @ApiProperty({
    description: "Client's email address",
    example: 'client@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email address format' })
  @Length(3, 100, {
    message: 'Email length must be between 5 and 100 characters',
  })
  email: string;
}
