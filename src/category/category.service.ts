import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category) private categoryModel: typeof Category) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, ...otherFields } = createCategoryDto;

    // Ensure name is saved in lowercase
    return this.categoryModel.create({
      ...otherFields,
      name: name.toLowerCase(),
    });
  }

  async findAll() {
    const categories = await this.categoryModel.findAll({
      include: { all: true },
    });

    return { data: categories, total: categories.length };
  }

  async findOne(id: number) {
    const category = await this.categoryModel.findByPk(id, {
      include: { all: true },
    });

    if (!category) {
      throw new BadRequestException(`ID:${id} Category does not exist!`);
    }

    return category; // Directly return the category instance
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name, ...otherFields } = updateCategoryDto;

    // Find the category by ID
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      throw new BadRequestException(`ID:${id} Category does not exist!`);
    }

    // Perform the update with lowercase transformation for name
    const updatedCategory = await category.update({
      ...otherFields,
      ...(name && { name: name.toLowerCase() }),
    });

    return updatedCategory;
  }

  async remove(id: number) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      throw new BadRequestException(`ID:${id} Category does not exists!`);
    }
    await this.categoryModel.destroy({ where: { id } });
    return {
      id,
      message: `ID: ${id} Category successfully deleted!`,
    };
  }
}
