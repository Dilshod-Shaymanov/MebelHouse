import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './models/review.model';
import { Product } from '../product/models/product.model';
import { JwtModule } from '@nestjs/jwt';
import { Order } from '../order/models/order.model';
import { OrderItems } from '../order_items/models/order_item.model';
import { Client } from '../client/models/client.model';

@Module({
  imports:[SequelizeModule.forFeature([Review, Product, Order, OrderItems, Client]), JwtModule.register({})],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports:[ReviewsService, SequelizeModule]
})
export class ReviewsModule {}
