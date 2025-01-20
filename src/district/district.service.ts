import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { InjectModel } from '@nestjs/sequelize';
import { District } from './models/district.model';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(District)
    private readonly districtModel: typeof District,
  ) {}

  async create(createDistrictDto: CreateDistrictDto){
    return await this.districtModel.create(createDistrictDto);
  }

  async findAll() {
    return await this.districtModel.findAll({ include: { all: true } });
  }

  async findOne(id: number) {
    const district = await this.districtModel.findByPk(id);
    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found.`);
    }
    return this.districtModel.findByPk(id, { include: { all: true } });
  }

  async update(id: number, updateDistrictDto: UpdateDistrictDto) {
    const district = await this.districtModel.findByPk(id);
    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found.`);
    }
    return await district.update(updateDistrictDto);
  }

  async remove(id: number) {
    const district = await this.districtModel.findByPk(id);
    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found.`);
    }
    return  district.destroy();
  }
}
