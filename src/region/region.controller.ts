import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Region')
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Yangi region yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Region muvaffaqiyatli yaratildi',
  })
  @ApiResponse({ status: 400, description: 'Xato malumotlar.' })
  @Post()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @ApiOperation({ summary: 'Region olish' })
  @ApiResponse({ status: 200, description: 'Regionlar royxati' })
  @Get()
  findAll() {
    return this.regionService.findAll();
  }

  @ApiOperation({ summary: 'Id orqali regionni olish' })
  @ApiParam({
    name: 'id',
    description: 'Region unikal ID raqami',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Region muvaffaqiyatli olingan' })
  @ApiResponse({ status: 404, description: 'Region topilmadi' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Id orqali regionni yangilash' })
  @ApiParam({
    name: 'id',
    description: 'Region unikal ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Region muvaffaqiyatli yangilandi.',
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @ApiResponse({ status: 404, description: 'Region topilmadi.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(+id, updateRegionDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Id orqali regionni o'chirish" })
  @ApiParam({
    name: 'id',
    description: 'Region unikal ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Region muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: 'Region topilmadi.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionService.remove(+id);
  }
}