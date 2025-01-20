import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './models/product.model';
import { PaginationDto } from './dto/pagination.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Mahsulotlar')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Yangi mahsulot yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Yangi mahsulot muvaffaqiyatli yaratildi.',
    type: Product,
  })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Retrieve all products with optional filtering, sorting, and pagination',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Filter by product name or description',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Order of sorting',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Minimum price for filtering',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Maximum price for filtering',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'id'],
    description: 'Sort by field (e.g., createdAt or id)',
  })
  @ApiResponse({ status: 200, description: 'List of products' })
  async findAll(@Query() query: PaginationDto) {
    // console.log('Received query:', query);

    const {
      filter,
      order = 'asc',
      page = 1,
      limit = 10,
      minPrice = 0,
      maxPrice = Infinity,
      sortBy = 'createdAt',
    } = query;

    const pageNum = parseInt(page.toString(), 10);
    const limitNum = parseInt(limit.toString(), 10);
    const minPriceNum = minPrice ? parseInt(minPrice.toString(), 10) : 0;
    const maxPriceNum = maxPrice ? parseInt(maxPrice.toString(), 10) : Infinity;

    return this.productService.findAll({
      filter,
      order,
      page: pageNum,
      limit: limitNum,
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
      sortBy,
    });
  }

  @ApiOperation({ summary: 'Mahsulotni ID orqali olish' })
  @ApiResponse({
    status: 200,
    description: 'Berilgan IDga ega mahsulot.',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Mahsulot topilmadi.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Mahsulotni yangilash' })
  @ApiResponse({
    status: 200,
    description: 'Mahsulot muvaffaqiyatli yangilandi.',
  })
  @ApiResponse({
    status: 404,
    description: 'Mahsulot topilmadi.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Mahsulotni o'chirish" })
  @ApiResponse({
    status: 200,
    description: "Mahsulot muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({
    status: 404,
    description: 'Mahsulot topilmadi.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
