
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
@Module({
    imports:[
  TypeOrmModule.forRootAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      host: configService.getOrThrow('DB_HOST'),
      port: configService.getOrThrow('DB_PORT'),
      username: configService.getOrThrow('DB_USERNAME'),
      password: configService.getOrThrow('DB_PASSWORD'),
      database: configService.getOrThrow('DB_NAME'),
      entities: [User,Category,Product], // Ensure this line includes the User entity
      synchronize: true,
    })
    }),
    ]
})
export class DatabaseModule {}
