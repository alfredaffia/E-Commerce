import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/user/dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService:AuthService
    ){}t
    
      @Post('signup')
      create(@Body() createUserDto: CreateUserDto) {
        return this.authService.create(createUserDto);
      }
      
      
          @Post('signin')
        signin(@Body() payload:LoginDto, @Res() res: Response) {
          return this.authService.signIn( payload, res);
        }
}
