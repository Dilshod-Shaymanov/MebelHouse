import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Wishlist } from './models/wishlist.model';
import { Client } from '../client/models/client.model';
import { Product } from '../product/models/product.model';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist) private wishlistModel: typeof Wishlist,
    @InjectModel(Client) private clientModel: typeof Client,
    @InjectModel(Product) private productModel: typeof Product,
  ) {}
  async toggle(createWishlistDto: CreateWishlistDto) {
    const client = await this.clientModel.findByPk(createWishlistDto.clientId);
    const product = await this.productModel.findByPk(
      createWishlistDto.productId,
    );
    if (!client) {
      throw new BadRequestException(
        `Client with ID: ${createWishlistDto.clientId} not found.`,
      );
    }
    if (!product) {
      throw new BadRequestException(
        `Product with ID: ${createWishlistDto.productId} not found.`,
      );
    }
    const existingWishlist = await this.wishlistModel.findOne({
      where: {
        clientId: createWishlistDto.clientId,
        productId: createWishlistDto.productId,
      },
    });
    console.log(existingWishlist);

    if (existingWishlist) {
      await this.wishlistModel.destroy({ where: { id: existingWishlist.id } });
      return { message: 'Wishlist deleted successfully' };
    }
    return this.wishlistModel.create(createWishlistDto);
  }

  // async findAll() {
  //   const wishes = await this.wishlistModel.findAll();
  //   return {
  //     data: wishes,
  //     total: wishes.length,
  //   };
  // }

  async findByClientId(clientId: number) {
    const client = await this.clientModel.findByPk(clientId);

    if (!client) {
      throw new BadRequestException(
        `User with ID: ${clientId} not found. (Id: ${clientId} bo'lgan foydalanuvchi topilmadi.)`,
      );
    }
    const wishes = await this.wishlistModel.findAll({
      where: { clientId: clientId },
    });
    return {
      data: wishes,
      total: wishes.length,
    };
  }

  // findOne(id: number) {
  //   return this.wishlistModel.findByPk(id);
  // }
}
