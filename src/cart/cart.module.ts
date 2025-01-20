import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from './models/cart.model';
import { Client } from '../client/models/client.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Cart, Client]), JwtModule.register({})],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
