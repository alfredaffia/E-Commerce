import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly categoryService: CategoriesService
  ) { }
  async create(createProductDto: CreateProductDto, currentUser: User) {
    try {
      const category = await this.categoryService.findOne(createProductDto.category)
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      const product = await this.productRepository.create(createProductDto)

      product.categories = category
      product.addedBy = currentUser
      

      return await this.productRepository.save(product)
    }
    catch (error) {
  throw new BadRequestException('Failed to upload product. Recheck categoryId and try again');
    }
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: string) {
    return await this.productRepository.findOne({
      where: { id: id },
      relations: {
        addedBy: true,
        categories: true
      },
      select: {
        addedBy: {
          id: true,
          userName: true,
          email: true
        },
        categories: {
          id: true,
          title: true,
          description: true
        }
      }
    })
  }

  async update(id: string, updateProductDto: UpdateProductDto, currentUser: User) {
    try{
    const newUpdate = await this.productRepository.findOne({ where: { id } })
    if (!newUpdate) {
      throw new NotFoundException('Product not found')
    }
    if (!updateProductDto || Object.keys(updateProductDto).length === 0) {
      throw new Error('No update values provided');
    }
    newUpdate.addedBy = currentUser

    if (updateProductDto.category) {
      const category = await this.categoryService.findOne(updateProductDto.category)
      newUpdate.categories = category
    }

    const updateProduct = await this.productRepository.update(id, updateProductDto)
    const updatedProduct = await this.productRepository.findOne({ where: { id } })

    return {
      statusCode: 200,
      message: 'category updated successfully',
      data: updatedProduct
    }
  }
  catch (error){
    throw new BadRequestException('A problem occured while updating your product')
  }
  }

  async remove(id: string) {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`product record with ID ${id} not found`);
    }
    const newresult = await this.productRepository.delete(id)

    return {
      message: `Product with ID ${id} deleted successfully`
    };
  }
}
