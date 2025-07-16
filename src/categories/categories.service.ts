import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category)
private categoryRepository:Repository<Category>
){}

 async create(createCategoryDto:CreateCategoryDto , currentUser:User){
  const category= await this.categoryRepository.create(createCategoryDto)
  category.addedBy=currentUser
  return await this.categoryRepository.save(category)
}
}