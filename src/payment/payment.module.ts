import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';
import { JwtModule } from '@nestjs/jwt';
import { Order } from '../order/models/order.model';

@Module({
  imports:[SequelizeModule.forFeature([Payment, Order]), JwtModule.register({})],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
