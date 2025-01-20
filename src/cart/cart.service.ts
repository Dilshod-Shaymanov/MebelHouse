import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './models/cart.model';
import { Client } from '../client/models/client.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart) private readonly cartModel: typeof Cart,
    @InjectModel(Client) private readonly clientModel: typeof Client,
  ) {}
  async create(createCartDto: CreateCartDto) {
    const client = await this.clientModel.findByPk(createCartDto.clientId);
    if (!client) {
      throw new NotFoundException(
        `Client with ID: ${createCartDto.clientId} not found.`,
      );
    }
    return await this.cartModel.create(createCartDto);
  }

  async findOne(id: number) {
    const cart = await this.cartModel.findOne({
      where: { id },
      include: { all: true },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID: ${id} not found.`);
    }
    return {
      data: cart,
    };
  }

  async remove(id: number) {
    const cart = await this.cartModel.findByPk(id);
    if (!cart) {
      throw new NotFoundException(`Cart with ID: ${id} not found.`);
    }
    await cart.destroy();
    return {
      message: 'Cart deleted successfully.',
    };
  }
}
