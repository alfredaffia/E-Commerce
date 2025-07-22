import { Controller, Get, Post, Body,  UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/utility/enum/user.role.enum';
import { Roles } from 'src/utility/decorators/role';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard(),RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post('newcategory')
  async create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() CurrentUser:User ) {
    return await this.categoriesService.create(createCategoryDto, CurrentUser);
  }

  @Get(':id')
  async findOne(@Body('id') id: string) {
    return await this.categoriesService.findOne(id);
  }

  @UseGuards(AuthGuard(),RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @UseGuards(AuthGuard())
  @Patch('update/:id') 
  async update(@Param('id')id:string, @Body() updateCategoryDto:UpdateCategoryDto){
return await this.categoriesService.update(id ,updateCategoryDto)
  }


  @Delete('delete/:id')
  async delete(@Param('id')id:string){
    return await this.categoriesService.remove(id)
  }
  }