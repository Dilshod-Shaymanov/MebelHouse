import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Payment } from './models/payment.model';
import { PaginationDto } from 'src/product/dto/pagination.dto';
import { ClientPaymentGuard } from '../common/guards/client-payment.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { AdminClientPaymentSelfGuard } from '../common/guards/admin-client-self-payment.guard';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(ClientPaymentGuard)
  @ApiOperation({ summary: 'Add new payment' })
  @ApiResponse({
    status: 201,
    description: 'Added new payment',
    type: Payment,
  })
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'All payments',
  //   type: [Payment],
  // })
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
  @ApiResponse({ status: 200, description: 'List of orders' })
  async findAll(@Query() query: PaginationDto) {
    // Query parametrlarini ajratib olish
    const { page = 1, limit = 10 } = query;

    // `page` va `limit`ni raqamga aylantirish (xatolarni oldini olish uchun)
    const pageNum = Math.max(parseInt(page.toString(), 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit.toString(), 10) || 10, 1);

    // Servisga parametrlarni yuborish va natijani qaytarish
    return this.paymentService.findAll({
      page: pageNum,
      limit: limitNum,
    });
  }

  @UseGuards(AdminClientPaymentSelfGuard)
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment by ID',
    type: Payment,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Updated payment',
    type: Payment,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Deleted payment',
    type: Number,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
