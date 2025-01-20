// import { IsOptional, IsNumber, IsString } from 'class-validator';
// import { Type } from 'class-transformer';
// import { ApiPropertyOptional } from '@nestjs/swagger';

// export class PaginationOrderDto {
//   @ApiPropertyOptional({
//     description: 'Order by name',
//     example: 'pending',
//     enum: ['pending', 'processing', 'shipped', 'cancelled'],
//   })
//   @IsOptional()
//   @IsString()
//   status?: 'pending' | 'processing' | 'shipped' | 'cancelled';

//   @ApiPropertyOptional({
//     description: 'Page number for pagination',
//     example: 1,
//   })
//   @IsOptional()
//   @Type(() => Number) // Convert to number
//   @IsNumber({}, { message: 'page must be a valid number' })
//   page?: number;

//   @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
//   @IsOptional()
//   @Type(() => Number) // Convert to number
//   @IsNumber({}, { message: 'limit must be a valid number' })
//   limit?: number;
// }
