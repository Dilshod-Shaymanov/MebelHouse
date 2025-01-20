import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('District')
@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Yangi district yaratish' })
  @ApiResponse({
    status: 201,
    description: 'District muvaffaqiyatli yaratildi',
  })
  @ApiResponse({ status: 400, description: 'Xato malumotlar.' })
  @Post()
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtService.create(createDistrictDto);
  }

  @ApiOperation({ summary: 'District olish' })
  @ApiResponse({ status: 200, description: 'Districtlar royxati' })
  @Get()
  findAll() {
    return this.districtService.findAll();
  }

  @ApiOperation({ summary: 'Id orqali districtni olish' })
  @ApiParam({
    name: 'id',
    description: 'District unikal ID raqami',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'District muvaffaqiyatli olingan' })
  @ApiResponse({ status: 404, description: 'District topilmadi' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Id orqali districtni yangilash' })
  @ApiParam({
    name: 'id',
    description: 'District unikal ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'District muvaffaqiyatli yangilandi.',
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @ApiResponse({ status: 404, description: 'District topilmadi.' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.districtService.update(+id, updateDistrictDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Id orqali districtni o'chirish" })
  @ApiParam({
    name: 'id',
    description: 'District unikal ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "District muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: 'District topilmadi.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.districtService.remove(+id);
  }
}
