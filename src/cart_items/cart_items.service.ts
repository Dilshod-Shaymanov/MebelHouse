import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';
import { InjectModel } from '@nestjs/sequelize';
import { CartItems } from './models/cart_item.model';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/models/cart.model';
import { Product } from '../product/models/product.model';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectModel(CartItems) private readonly cartItemModel: typeof CartItems,
    @InjectModel(Cart) private readonly cartModel: typeof Cart,
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}
  async create(createCartItemDto: CreateCartItemDto) {
    const cart = await this.cartModel.findByPk(createCartItemDto.cartId);
    const product = await this.productModel.findByPk(
      createCartItemDto.productId,
    );
    if (!cart) {
      throw new NotFoundException(
        `Cart with ID: ${createCartItemDto.cartId} not found.`,
      );
    }
    if (!product) {
      throw new NotFoundException(
        `Product with ID: ${createCartItemDto.productId} not found.`,
      );
    }
    if(product.id === createCartItemDto.productId) {
      return {
        message: 'Cannot add same product twice'
      }
    }
    return await this.cartItemModel.create(createCartItemDto);
  }

  async findAll() {
    const cartItems = await this.cartItemModel.findAll();
    return {
      data: cartItems,
      total: cartItems.length,
    }
  }

  async findOne(id: number) {
    const cartItem = await this.cartItemModel.findByPk(id);
    if (!cartItem) {
      throw new NotFoundException(`CartItem with ID: ${id} not found.`);
    }
    return cartItem;
  }

  async update(id: number, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.cartItemModel.findByPk(id);
    if (!cartItem) {
      throw new NotFoundException(`CartItem with ID: ${id} not found.`);
    }
    await cartItem.update(updateCartItemDto);
    return cartItem;
  }

  async remove(id: number) {
    const cartItem = await this.cartItemModel.findByPk(id);
    if (!cartItem) {
      throw new NotFoundException(`CartItem with ID: ${id} not found.`);
    }
    await cartItem.destroy();
    return {
      message: 'CartItem deleted successfully.',
    };
  }
}
