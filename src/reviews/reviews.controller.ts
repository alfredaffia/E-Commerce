import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/utility/decorators/role';
import { UserRole } from 'src/utility/enum/user.role.enum';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() currentUser: User) {
    return this.reviewsService.create(createReviewDto, currentUser);
  }

  @Get('/all')
  findAll() {
    return this.reviewsService.findAll();
  }
  @Get('/')
  async findAllByProduct(@Body('productId') productId: string) {
    return await this.reviewsService.findAllByProduct(productId)
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reviewsService.findOne(id);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
