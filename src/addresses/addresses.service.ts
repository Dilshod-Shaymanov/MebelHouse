import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './models/address.model';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address)
    private readonly addressModel:typeof Address,
  ) {}

  async create(CreateAddressDto: CreateAddressDto) {
    return await this.addressModel.create(CreateAddressDto);
  }

  async findAll() {
    return await this.addressModel.findAll({include:{all:true}});
  }

  async findOne(id: number) {
    const address = await this.addressModel.findByPk(id);
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found.`);
    }
    return this.addressModel.findByPk(id, { include: { all: true } });
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressModel.findByPk(id);
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found.`);
    }
    return await address.update(updateAddressDto);
  }

  async remove(id: number) {
    const address = await this.addressModel.findByPk(id);
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found.`);
    }
    await address.destroy();
    return { message: `Address with ID ${id} has been deleted.` };
  }
}
