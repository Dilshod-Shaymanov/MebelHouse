import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './models/review.model';
import { Product } from '../product/models/product.model';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private readonly reviewModel: typeof Review,
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}
  async create(createReviewDto: CreateReviewDto) {
    const product = await this.productModel.findByPk(
      createReviewDto.productId,
      {
        include: { model: Review },
      },
    );

    if (!product) {
      throw new NotFoundException(
        `Product with id ${createReviewDto.productId} not found.`,
      );
    }

    const existingReview = await this.reviewModel.findOne({
      where: {
        clientId: createReviewDto.clientId,
        productId: createReviewDto.productId,
      },
    });
    if (existingReview) {
      throw new ForbiddenException('You are already rated');
    }

    // Create the new review with formatted date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const formattedTime = currentDate.toTimeString().split(' ')[0]; // Format as HH:mm:ss

    const newReview = await this.reviewModel.create({
      ...createReviewDto,
      createdAt: formattedDate,
      createdTime: formattedTime,
    });

    // Calculate avg_rating
    const reviews = await this.reviewModel.findAll({
      where: { productId: createReviewDto.productId },
    });
    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await product.update({ avg_rating: avgRating });

    return newReview;
  }

  async findAll() {
    const review = await this.reviewModel.findAll({ include: { all: true } });
    return {
      data: review,
      total: review.length,
    };
  }

  async findOne(id: number) {
    const review = await this.reviewModel.findByPk(+id, {
      include: { all: true },
    });
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found.`);
    }
    return {
      data: review,
    };
  }

  // async update(id: number, updateReviewDto: UpdateReviewDto) {
  //   const review = await this.reviewModel.findByPk(id);
  //   if (!review) {
  //     throw new NotFoundException(`Review with id ${id} not found.`);
  //   }
  //   const updatedReview = review.update({
  //     ...updateReviewDto,
  //     clientId: review.clientId,
  //     productId: review.productId,
  //   });
  //   return updatedReview;
  // }

  // async remove(id: number) {
  //   const review = await this.reviewModel.findByPk(id);
  //   if (!review) {
  //     throw new NotFoundException(`Review with id ${id} not found.`);
  //   }
  //   await this.reviewModel.destroy({ where: { id } });
  //   return {
  //     id,
  //     message: `ID: ${id} Review has been deleted.`,
  //   };
  // }
}
