import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Rasm URL manzillari',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image: string[];
}
