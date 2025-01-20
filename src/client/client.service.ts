import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Client } from './models/client.model';
import { PaginationDto } from '../product/dto/pagination.dto';
import { Op } from 'sequelize';

@Injectable()
export class ClientService {
  constructor(@InjectModel(Client) private clientModel: typeof Client) {}
  async findAll(query: PaginationDto): Promise<{
    data: Client[];
    page: number;
    limit: number;
    total: number;
  }> {

    // const clients = await this.clientModel.findAll({ include: { all: true } });
    // return {
    //   data: clients,
    //   total: clients.length,
    // };

    const {
      filter,
      order = 'asc',
      page = 1,
      limit = 10,
    } = query;

    const offset = (page - 1) * limit;

    const where: any = {};

    // Add filter to where clause
    if (filter) {
      where[Op.or] = [
        { email: { [Op.like]: `%${filter}%` } },
        { phone_number: { [Op.like]: `%${filter}%` } },
      ];
    }

    try {
      const { rows: data, count: total } =
        await this.clientModel.findAndCountAll({
          where,
          order: [
            ['createdAt', order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'],
          ],
          offset,
          limit,
        });

      return {
        data,
        page,
        limit,
        total,
      };
    } catch (error) {
      console.error('Error fetching products:', error.message);
      throw error;
    }
  }

  async findOne(id: number) {
    const client = await this.clientModel.findByPk(id);

    if (!client) {
      throw new BadRequestException(
        `client with ID: ${id} not found. (ID: ${id} bo'lgan foydalanuvchi topilmadi.)`,
      );
    }

    return this.clientModel.findOne({ where: { id }, include: { all: true } });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.clientModel.findByPk(id);
    if (!client) {
      throw new BadRequestException(`ID:${id} client does not exists!`);
    }
    const updatedFields = { ...updateClientDto };
    const updatedClient = await this.clientModel.update(updatedFields, {
      where: { id },
      returning: true,
    });
    return updatedClient[1][0];
  }

  async remove(id: number) {
    const client = await this.clientModel.findByPk(id);

    if (!client) {
      return { message: `ID: ${id} client does not exists!` };
    }
    await this.clientModel.destroy({ where: { id } });
    return {
      message: `client with ID: ${id} successfully deleted.`,
    };
  }
}
