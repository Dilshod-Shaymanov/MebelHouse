import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by name or description',
    example: 'laptop',
  })
  @IsOptional()
  @IsString()
  filter?: string;

  @ApiPropertyOptional({
    description: 'Order by name',
    example: 'asc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Order by name',
    example: 'pending',
    enum: ['pending', 'processing', 'shipped', 'cancelled'],
  })
  @IsOptional()
  @IsString()
  status?: 'pending' | 'processing' | 'shipped' | 'cancelled';

  // @ApiPropertyOptional({
  //   description: 'Order by name',
  //   example: 'asc',
  //   enum: ['asc', 'desc'],
  // })
  // @IsOptional()
  // @IsString()
  // price?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Minimum price filter', example: 100 })
  @IsOptional()
  @Type(() => Number) // Convert to number
  @IsNumber({}, { message: 'minPrice must be a valid number' })
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price filter', example: 1000 })
  @IsOptional()
  @Type(() => Number) // Convert to number
  @IsNumber({}, { message: 'maxPrice must be a valid number' })
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number) // Convert to number
  @IsNumber({}, { message: 'page must be a valid number' })
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
  @IsOptional()
  @Type(() => Number) // Convert to number
  @IsNumber({}, { message: 'limit must be a valid number' })
  limit?: number;

  @ApiPropertyOptional({
    description: 'Sort by field (e.g., createdAt or id)',
    example: 'createdAt',
    enum: ['createdAt', 'id'],
  })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'id';
}
