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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './models/category.model';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Kategoriyalar')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Yangi kategoriya yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Yangi kategoriya muvaffaqiyatli yaratildi.',
    type: Category,
  })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Barcha kategoriyalarni olish' })
  @ApiResponse({
    status: 200,
    description: "Barcha kategoriyalar ro'yxati.",
    type: [Category],
  })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Kategoriya ID orqali olish' })
  @ApiResponse({
    status: 200,
    description: 'Berilgan IDga ega kategoriya.',
    type: Category,
  })
  @ApiResponse({
    status: 404,
    description: 'Kategoriya topilmadi.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Kategoriya yangilash' })
  @ApiResponse({
    status: 200,
    description: 'Kategoriya muvaffaqiyatli yangilandi.',
  })
  @ApiResponse({
    status: 404,
    description: 'Yangilanish uchun kategoriya topilmadi.',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Kategoriya o'chirish" })
  @ApiResponse({
    status: 200,
    description: "Kategoriya muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({
    status: 404,
    description: "O'chirish uchun kategoriya topilmadi.",
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
