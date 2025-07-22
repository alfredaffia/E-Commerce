import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category)
  private categoryRepository: Repository<Category>
  ) { }

  async create(createCategoryDto: CreateCategoryDto, currentUser: User) {

    const { title } = createCategoryDto
    const categoryTitle = await this.categoryRepository.findOne({ where: { title: title } })
    if (categoryTitle) {
      throw new HttpException('category already exists', 400)
    }

    const category = await this.categoryRepository.create(createCategoryDto)
    category.addedBy = currentUser
    return await this.categoryRepository.save(category)
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOneBy({ id })
    if (!category) {
      throw new Error('Category not found')
    }
    return category
  }

  async findAll() {
    return await this.categoryRepository.find({ relations: ['addedBy'] ,
        select:{
    addedBy:{
      id:true,
      userName:true,
      email:true
    },}
    })
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const newUpdate = await this.categoryRepository.findOne({ where: { id } })
    if (!newUpdate) {
      throw new NotFoundException('category not found')
    }

    const updatecategory = await this.categoryRepository.update(id, updateCategoryDto)
    const updatedCategory = await this.categoryRepository.findOne({ where: { id } })
    return {
      statusCode: 200,
      message: 'category updated successfully',
      data: updatedCategory
    }
  }

  async remove(id: string) {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    const newresult = await this.categoryRepository.delete(id)

    return {
      message: `category record with ID ${id} deleted successfully`
    };
  }
}