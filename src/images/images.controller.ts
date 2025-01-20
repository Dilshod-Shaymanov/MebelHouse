import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Image } from './models/image.model';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Rasmlar')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiOperation({ summary: 'Yangi rasmlar yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Yangi rasmlar muvaffaqiyatli yaratildi.',
    type: [Image],
  })
  @Post()
  @UseInterceptors(FilesInterceptor('images')) // Bir nechta faylni yuklash uchun
  create(
    @Body() createImageDto: CreateImageDto,
    @UploadedFiles() images: any[],
  ) {
    return this.imagesService.create(createImageDto, images);
  }

  @ApiOperation({ summary: 'Barcha rasmlarni olish' })
  @ApiResponse({
    status: 200,
    description: "Barcha rasmlar ro'yxati.",
    type: [Image],
  })
  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @ApiOperation({ summary: 'Rasm ID orqali olish' })
  @ApiResponse({
    status: 200,
    description: 'Berilgan IDga ega rasm.',
    type: Image,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Rasmni yangilash' })
  @ApiResponse({
    status: 200,
    description: 'Rasm muvaffaqiyatli yangilandi.',
  })
  @ApiResponse({
    status: 404,
    description: 'Rasm topilmadi.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @ApiOperation({ summary: "Rasmni o'chirish" })
  @ApiResponse({
    status: 200,
    description: "Rasm muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({
    status: 404,
    description: 'Rasm topilmadi.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}
