import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './models/cart.model';
import { ClientSelfBodyGuard } from '../common/guards/client-self-body.guard';
import { ClientSelfGuard } from '../common/guards/client-self.guard';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(ClientSelfBodyGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiResponse({
    status: 201,
    description: 'Cart created successfully.',
    type: Cart,
  })
  @ApiBody({ type: CreateCartDto })
  create(@Body() createCartDto: CreateCartDto) {
    try {
      return this.cartService.create(createCartDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single cart by ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully.',
    type: Cart,
  })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID of the cart to retrieve',
  })
  findOne(@Param('id') id: string) {
    try {
      return this.cartService.findOne(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(ClientSelfGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cart by ID' })
  @ApiResponse({ status: 200, description: 'Cart deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID of the cart to delete',
  })
  remove(@Param('id') id: string) {
    try {
      return this.cartService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
