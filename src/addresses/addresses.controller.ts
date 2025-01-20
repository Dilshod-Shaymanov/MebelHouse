import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Address')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @ApiOperation({ summary: 'Yangi addresses yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Address muvaffaqiyatli yaratildi',
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Barcha addreslarni olish' })
  @ApiResponse({ status: 200, description: "Adresslar ro'yxati" })
  @Get()
  findAll() {
    return this.addressesService.findAll();
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Id orqali addressni olish' })
  @ApiParam({
    name: 'id',
    description: 'Adress unikal ID raqami',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Adress muvaffaqiyatli olingan' })
  @ApiResponse({ status: 404, description: 'Address topilmadi' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Address ma'lumotlarini yangilash" })
  @ApiParam({
    name: 'id',
    description: 'Address unikal ID raqami',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Address muvaffaqiyatli yangilandi.',
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @ApiResponse({ status: 404, description: 'Address topilmadi.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(+id, updateAddressDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Addressni o'chirish" })
  @ApiParam({
    name: 'id',
    description: 'Address unikal ID raqami',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Address muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: 'Address topilmadi.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressesService.remove(+id);
  }
}
