import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Elektronika',
    description: 'Kategoriya nomi',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Qurilmalar va gadjetlar',
    description: 'Kategoriya tavsifi',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
