import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region } from './models/region.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RegionService {
  constructor(
    @InjectModel(Region)
    private readonly regionModel: typeof Region,
  ) {}

  async create(createRegionDto: CreateRegionDto) {
    return await this.regionModel.create(createRegionDto);
  }

  async findAll() {
    return await this.regionModel.findAll({ include: { all: true } });
  }

  async findOne(id: number) {
    const region = await this.regionModel.findByPk(id);
    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found.`);
    }
    return this.regionModel.findByPk(id, { include: { all: true } });
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    const region = await this.regionModel.findByPk(id);
    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found.`);
    }
    return await region.update(updateRegionDto);
  }

  async remove(id: number) {
    const region = await this.regionModel.findByPk(id);
    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found.`);
    }
    return region.destroy();
  }
}
