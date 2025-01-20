import { Module } from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CartItemsController } from './cart_items.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartItems } from './models/cart_item.model';
import { Cart } from '../cart/models/cart.model';
import { Product } from '../product/models/product.model';

@Module({
  imports:[SequelizeModule.forFeature([CartItems, Cart, Product])],
  controllers: [CartItemsController],
  providers: [CartItemsService],
})
export class CartItemsModule {}
