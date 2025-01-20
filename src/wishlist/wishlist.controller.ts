import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';
import { ClientSelfBodyGuard } from '../common/guards/client-self-body.guard';
import { ClientSelfGuard } from '../common/guards/client-self.guard';

@ApiTags('Wishlist') // Corrected spelling
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(ClientSelfBodyGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new like' })
  @ApiResponse({ status: 201, description: 'Like created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  toggle(@Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistService.toggle(createWishlistDto);
  }

  // @UseGuards(AdminGuard)
  // @Get()
  // @ApiOperation({ summary: 'Retrieve all likes (Admin only)' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'List of all likes retrieved successfully',
  // })
  // @ApiResponse({ status: 403, description: 'Forbidden' })
  // findAll() {
  //   return this.wishlistService.findAll();
  // }

  // @UseGuards(AdminGuard)
  // @Get(':id')
  // @ApiOperation({ summary: 'Retrieve a like by ID (Admin only)' })
  // @ApiParam({ name: 'id', description: 'Unique identifier of the like' })
  // @ApiResponse({ status: 200, description: 'Like retrieved successfully' })
  // @ApiResponse({ status: 404, description: 'Like not found' })
  // findOne(@Param('id') id: string) {
  //   return this.wishlistService.findOne(+id);
  // }

  @UseGuards(ClientSelfGuard)
  @Get('client/:id')
  @ApiOperation({ summary: 'Retrieve all likes by a specific Client' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({
    status: 200,
    description: 'Client likes retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found or no likes found',
  })
  findByClientId(@Param('id') id: string) {
    return this.wishlistService.findByClientId(+id);
  }
}
