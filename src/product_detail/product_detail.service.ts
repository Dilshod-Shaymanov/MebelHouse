import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDetailDto } from './dto/create-product_detail.dto';
import { UpdateProductDetailDto } from './dto/update-product_detail.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ProductDetail } from './models/product_detail.model';

@Injectable()
export class ProductDetailService {
  constructor(
    @InjectModel(ProductDetail)
    private ProductDetailModel: typeof ProductDetail,
  ) {}

  create(createProductDetailDto: CreateProductDetailDto) {
    return this.ProductDetailModel.create(createProductDetailDto);
  }

  async findAll() {
    const product_details = await this.ProductDetailModel.findAll({
      include: { all: true },
    });
    return { data: product_details, total: product_details.length };
  }

  async findOne(id: number) {
    const product_detail = await this.ProductDetailModel.findByPk(id);
    if (!product_detail) {
      throw new BadRequestException(`ID:${id} Product Detail does not exists!`);
    }
    const productDetail = this.ProductDetailModel.findByPk(+id, {
      include: { all: true },
    });
    return productDetail
  }

  async update(id: number, updateProductDetailDto: UpdateProductDetailDto) {
    const product_detail = await this.ProductDetailModel.findByPk(id);
    if (!product_detail) {
      throw new BadRequestException(`ID:${id} Product Detail does not exists!`);
    }
    const update = await this.ProductDetailModel.update(
      updateProductDetailDto,
      {
        where: { id },
        returning: true,
      },
    );
    return update[1][0];
  }

  async remove(id: number) {
    const product_detail = await this.ProductDetailModel.findByPk(id);
    if (!product_detail) {
      throw new BadRequestException(`ID:${id} Product Detail does not exists!`);
    }
    await this.ProductDetailModel.destroy({ where: { id } });
    return { message: `ID: ${id} Product Detail successfully deleted!` };
  }
}
