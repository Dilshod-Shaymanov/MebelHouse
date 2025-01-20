// Updated product.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { Op } from 'sequelize';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product) private productModel: typeof Product) {}

  async create(createProductDto: CreateProductDto) {
    const { name, description, ...otherFields } = createProductDto;

    if (!name) {
      throw new BadRequestException('Name is required.');
    }
    if (!description) {
      throw new BadRequestException('Description is required.');
    }

    return this.productModel.create({
      ...otherFields,
      name: name.toLowerCase(),
      description: description.toLowerCase(),
    });
  }

  async findAll(query: PaginationDto): Promise<{
    data: Product[];
    page: number;
    limit: number;
    total: number;
  }> {
    const {
      filter,
      order = 'asc',
      page = 1,
      limit = 10,
      minPrice = 0,
      maxPrice = Infinity,
      sortBy = 'createdAt', // Default field for sorting
    } = query;

    const offset = (page - 1) * limit;

    const where: any = {};

    // Add price range to where clause
    if (minPrice || maxPrice) {
      where.price = { [Op.between]: [minPrice, maxPrice] };
    }

    // Add filter to where clause
    if (filter) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filter}%` } },
        { description: { [Op.like]: `%${filter}%` } },
      ];
    }

    try {
      const { rows: data, count: total } =
        await this.productModel.findAndCountAll({
          where,
          order: [
            [sortBy, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'],
            ["price", order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'],
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
    const product = await this.productModel.findByPk(id, {
      include: { all: true },
    });
    if (!product) {
      throw new NotFoundException(`ID:${id} Product does not exist!`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { name, description, ...otherFields } = updateProductDto;

    const product = await this.productModel.findByPk(id);
    if (!product) {
      throw new NotFoundException(`ID:${id} Product does not exist!`);
    }

    const updatedFields = {
      ...otherFields,
      ...(name && { name: name.toLowerCase() }), // Only update if name is provided
      ...(description && { description: description.toLowerCase() }), // Only update if description is provided
    };

    await product.update(updatedFields);

    return product;
  }

  async remove(id: number) {
    const product = await this.productModel.findByPk(id);
    if (!product) {
      throw new NotFoundException(`ID:${id} Product does not exist!`);
    }
    await this.productModel.destroy({ where: { id } });
    return { id, message: `ID: ${id} Product successfully deleted!` };
  }
}
