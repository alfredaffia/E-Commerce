import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/utility/decorators/role';
import { UserRole } from 'src/utility/enum/user.role.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createProductDto: CreateProductDto,@CurrentUser() currentUser:User) {
    return this.productsService.create(createProductDto,currentUser);
  }

  @Get()
  async findAll() {
    return  this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
