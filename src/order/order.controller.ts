import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from './models/order.model';
import { PaginationDto } from '../product/dto/pagination.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { ClientSelfBodyGuard } from '../common/guards/client-self-body.guard';
import { AdminClientSelfGuard } from '../common/guards/admin-clientSelf.guard';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(ClientSelfBodyGuard)
  @ApiOperation({ summary: 'Add new order' })
  @ApiResponse({
    status: 201,
    description: 'Added new order',
    type: Order,
  })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  // @ApiOperation({ summary: 'Get all orders' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'All orders',
  //   type: [Order],
  // })
  // @Get()
  // findAll() {
  //   return this.orderService.findAll();
  // }

  @UseGuards(AdminGuard)
  @Get()
  @ApiOperation({
    summary:
      'Retrieve all orders with optional filtering, sorting, and pagination',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'processing', 'shipped', 'cancelled'],
    description: 'Filter orders by status',
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
  @ApiResponse({ status: 200, description: 'List of orders' })
  async findAll(@Query() query: PaginationDto) {
    // Query parametrlarini ajratib olish
    const { status, page = 1, limit = 10 } = query;

    // `page` va `limit`ni raqamga aylantirish (xatolarni oldini olish uchun)
    const pageNum = Math.max(parseInt(page.toString(), 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit.toString(), 10) || 10, 1);

    // Servisga parametrlarni yuborish va natijani qaytarish
    return this.orderService.findAll({
      status,
      page: pageNum,
      limit: limitNum,
    });
  }

  @UseGuards(AdminClientSelfGuard)
  @ApiOperation({ summary: 'Get orders by ID' })
  @ApiResponse({
    status: 200,
    description: 'All orders by ID',
    type: Order,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @ApiOperation({ summary: 'Get orders by Clietn ID' })
  @ApiResponse({
    status: 200,
    description: 'All orders by Client ID',
    type: [Order],
  })
  @Get(':id')
  findByClientId(@Query('clientId') clientId: string) {
    // Query parameterdan olingan `clientId`ni service'ga yuboramiz
    return this.orderService.findByClientId(+clientId);
  }

  @UseGuards(AdminClientSelfGuard)
  @ApiOperation({ summary: 'Update order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Updated order',
    type: Order,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @UseGuards(AdminClientSelfGuard)
  @ApiOperation({ summary: 'Delete order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Deleted order',
    type: Number,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
