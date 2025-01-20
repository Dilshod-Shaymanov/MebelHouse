import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientReviewGuard } from '../common/guards/client-review.guard';

@ApiTags('Reviews') // Tag for Swagger grouping
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(ClientReviewGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new Review' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Review created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided',
  })
  async create(@Body() createReviewDto: CreateReviewDto) {
    try {
      const review = await this.reviewsService.create(createReviewDto);
      return {
        message: 'Review created successfully',
        data: review,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all reviews' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of reviews retrieved successfully',
  })
  async findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a review by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Review retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Review not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update a review by ID' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Review updated successfully',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Review not found',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Invalid data provided',
  // })
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateReviewDto: UpdateReviewDto,
  // ) {
  //   return this.reviewsService.update(id, updateReviewDto);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a review by ID' })
  // @ApiResponse({
  //   status: HttpStatus.NO_CONTENT,
  //   description: 'Review deleted successfully',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Review not found',
  // })
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reviewsService.remove(+id);
  // }
}
