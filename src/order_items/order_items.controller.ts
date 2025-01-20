import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderItems } from './models/order_item.model';

@ApiTags('Order-items')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @ApiOperation({ summary: 'Add new order item' })
  @ApiResponse({
    status: 201,
    description: 'Added new order item',
    type: OrderItems,
  })
  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @ApiOperation({ summary: 'Get all order items' })
  @ApiResponse({
    status: 200,
    description: 'All order items',
    type: [OrderItems],
  })
  @Get()
  findAll() {
    return this.orderItemsService.findAll();
  }

  @ApiOperation({ summary: 'Get order items by ID' })
  @ApiResponse({
    status: 200,
    description: 'All order item by ID',
    type: OrderItems,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderItemsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update order item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Updated order item',
    type: OrderItems,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(+id, updateOrderItemDto);
  }

  @ApiOperation({ summary: 'Delete order item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Deleted order item',
    type: Number,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderItemsService.remove(+id);
  }
}
