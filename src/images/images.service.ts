import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from './models/image.model';
import { FileService } from '../file/file.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Image) private imageModel: typeof Image,
    private readonly fileService: FileService,
  ) {}

  async create(createImageDto: CreateImageDto, images: any[]): Promise<Image> {
    // Fayllarni saqlash
    const fileNames = await Promise.all(
      images.map((image) => this.fileService.saveFile(image)),
    );

    // Rasmni yaratish
    return this.imageModel.create({
      ...createImageDto,
      image: fileNames, // Fayllar nomlarini saqlash
    });
  }

  async findAll() {
    const images = await this.imageModel.findAll({ include: { all: true } });
    return { data: images, total: images.length };
  }

  async findOne(id: number) {
    const image = await this.imageModel.findByPk(id);
    if (!image) {
      throw new BadRequestException(`ID:${id} Image does not exist!`);
    }
    return this.imageModel.findByPk(+id, { include: { all: true } });
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    const image = await this.imageModel.findByPk(id);
    if (!image) {
      throw new BadRequestException(`ID:${id} Image does not exist!`);
    }
    const update = await this.imageModel.update(updateImageDto, {
      where: { id },
      returning: true,
    });
    return update;
  }

  async remove(id: number) {
    const image = await this.imageModel.findByPk(id);
    if (!image) {
      throw new BadRequestException(`ID:${id} Image does not exist!`);
    }
    return this.imageModel.destroy({ where: { id } });
  }
}
