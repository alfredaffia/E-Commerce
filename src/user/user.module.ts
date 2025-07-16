import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as dotenv from 'dotenv'
import { AuthModule } from 'src/auth/auth.module';
dotenv.config()

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
      AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService,],
  exports:[UserService]
})
export class UserModule {}
