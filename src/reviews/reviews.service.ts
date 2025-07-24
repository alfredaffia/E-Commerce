import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { PrimaryGeneratedColumn, Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly productService: ProductsService
  ) { }
  async create(createReviewDto: CreateReviewDto, currentUser: User) {
    const product = await this.productService.findOne(createReviewDto.productId);
    if (!product) {
      throw new Error('Product not found');
    }
    let review = await this.findOneByUserAndProduct(currentUser.id, createReviewDto.productId);
    if (!review) {
      review = this.reviewRepository.create(createReviewDto);
      review.user = currentUser;
      review.product = product;
    } else {
      review.comments = createReviewDto.comments
      review.ratings = createReviewDto.ratings
    }

    const savedreview= await this.reviewRepository.save(review)
    console.log(savedreview); // Debugging line to check the saved review
    return savedreview;
  }

  findAll() {
    return `This action returns all reviews`;
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          categories: true
        }
      }
    })
    if (!review) {
      throw new NotFoundException('review not found')
    }
    return review
  }

  async findAllByProduct(id: string) {
    const product = await this.productService.findOne(id)
    return await this.reviewRepository.find({
      where: { product: { id } },
      relations: {
        user: true,
        product: {
          categories: true
        },
      }
    })
  }

  async remove(id: string) {
    const result = await this.reviewRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`review with ID ${id} not found`);
    }
    const newresult = await this.reviewRepository.delete(id)

    return {
      message: `review with ID ${id} deleted successfully`
    };
  }

  async findOneByUserAndProduct(userId: string, ProductId: string) {
    return this.reviewRepository.findOne({
      where: {
        user: {
          id: userId
        },
        product: {
          id: ProductId
        }
      },
      relations: {
        user: true,
        product: {
          categories: true
        }
      }
    })

  }
}
