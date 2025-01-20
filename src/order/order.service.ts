import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { PaginationDto } from '../product/dto/pagination.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order) private readonly orderModel: typeof Order) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.orderModel.create(createOrderDto);
  }

  // async findAll() {
  //   const orders = await this.orderModel.findAll({ include: { all: true } });
  //   return { data: orders, total: orders.length };
  // }

  async findAll(query: PaginationDto): Promise<{
    data: Order[];
    page: number;
    limit: number;
    total: number;
  }> {
    const {
      status, // Status bo'yicha qidiruv uchun parametr
      page = 1,
      limit = 10,
    } = query;

    // `page` va `limit` ni tasdiqlash
    const validPage = Math.max(Number(page) || 1, 1);
    const validLimit = Math.max(Number(limit) || 10, 1);

    const offset = (validPage - 1) * validLimit;

    // Dinamik `where` obyektini yaratish
    const where: any = {};
    if (status) {
      where.status = status; // Status bo'yicha filtr
    }

    try {
      // Ma'lumotlarni olish
      const { rows: data, count: total } =
        await this.orderModel.findAndCountAll({
          where, // Status sharti
          offset, // Paginatsiya
          limit: validLimit,
          include:{all:true}
        });

      return {
        data,
        page: validPage,
        limit: validLimit,
        total,
      };
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      throw new Error('Failed to fetch orders. Please try again.');
    }
  }

  findOne(id: number) {
    return this.orderModel.findByPk(id);
  }

  async findByClientId(clientId: number) {
    const orders = await this.orderModel.findAll({
      where: { clientId }, // clientId bo'yicha filtr
      include: { all: true }, // Barcha bog‘liq ma’lumotlarni olish uchun
    });
    return { data: orders, total: orders.length };
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const updated_order = await this.orderModel.update(updateOrderDto, {
      where: { id },
      returning: true,
    });
    return updated_order[1][0];
  }

  remove(id: number) {
    return this.orderModel.destroy({ where: { id } });
  }
}
