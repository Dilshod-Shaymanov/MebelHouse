import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItems } from './models/order_item.model';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectModel(OrderItems)
    private readonly orderItemsModel: typeof OrderItems,
  ) {}

  create(createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsModel.create(createOrderItemDto);
  }

  async findAll() {
    const order_items = await this.orderItemsModel.findAll({
      include: { all: true },
    });
    return { data: order_items, total: order_items.length };
  }

  findOne(id: number) {
    return this.orderItemsModel.findByPk(id);
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const updated_orderItems = await this.orderItemsModel.update(
      updateOrderItemDto,
      {
        where: { id },
        returning: true,
      },
    );
    return updated_orderItems[1][0];
  }

  remove(id: number) {
    return this.orderItemsModel.destroy({ where: { id } });
  }
}
