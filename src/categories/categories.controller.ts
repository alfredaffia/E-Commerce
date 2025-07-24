import { Controller, Get, Post, Body, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/role.guard';
import { CurrentUser } from '../utility/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../utility/enum/user.role.enum';
import { Roles } from'../utility/decorators/role';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post('newcategory')
  async create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() CurrentUser: User) {
    return await this.categoriesService.create(createCategoryDto, CurrentUser);
  }

  @Get(':id')
  async findOne(@Body('id') id: string) {
    return await this.categoriesService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @CurrentUser() currentUser:User) {
    return await this.categoriesService.update(id, updateCategoryDto, currentUser)
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.categoriesService.remove(id)
  }
}