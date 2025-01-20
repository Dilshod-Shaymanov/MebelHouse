import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';
import { PaginationDto } from 'src/product/dto/pagination.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment) private readonly paymentModel: typeof Payment,
  ) {}

  create(createPaymentDto: CreatePaymentDto) {
    return this.paymentModel.create(createPaymentDto);
  }

  async findAll(query: PaginationDto): Promise<{
    data: Payment[];
    page: number;
    limit: number;
    total: number;
  }> {
    const { page = 1, limit = 10 } = query;    

    // `page` va `limit` ni tasdiqlash
    const validPage = Math.max(Number(page) || 1, 1);
    const validLimit = Math.max(Number(limit) || 10, 1);

    const offset = (validPage - 1) * validLimit;

    // Dinamik `where` obyektini yaratish
    const where: any = {};

    try {
      // Ma'lumotlarni olish
      const { rows: data, count: total } =
        await this.paymentModel.findAndCountAll({
          where, // Status sharti
          offset, // Paginatsiya
          limit: validLimit,
          include: { all: true },
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
    return this.paymentModel.findOne({ where: { id }, include: { all: true } });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const updated_payment = await this.paymentModel.update(updatePaymentDto, {
      where: { id },
      returning: true,
    });
    return updated_payment[1][0];
  }

  remove(id: number) {
    return this.paymentModel.destroy({ where: { id } });
  }
}
