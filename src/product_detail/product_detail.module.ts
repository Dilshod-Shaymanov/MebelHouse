import { Module } from '@nestjs/common';
import { ProductDetailService } from './product_detail.service';
import { ProductDetailController } from './product_detail.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductDetail } from './models/product_detail.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([ProductDetail]), JwtModule.register({})],
  controllers: [ProductDetailController],
  providers: [ProductDetailService],
})
export class ProductDetailModule {}
