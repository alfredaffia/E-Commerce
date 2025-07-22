import { ConflictException, HttpException, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { LoginDto } from 'src/user/dto/login.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) { }

  async create(payload: CreateUserDto) {
    const { email, userName, password, ...rest } = payload;
    payload.email = payload.email.toLowerCase()
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) {
      throw new ConflictException('user alredy exists')
    }
if (!password) {
      throw new Error('Password is required');
    }
    const hashPassword = await argon2.hash(password)
    let userDetails = await this.userRepository.create({
      email,
      password: hashPassword,
      userName,
      ...rest
    })

    // delete userDetails.password

    const userPayload = {
      id: userDetails.id,
      email: userDetails.email,
      userName: userDetails.userName,
      role: userDetails.role
    }
    return {
      userId: userDetails.id,
      userName: userDetails.userName,
      userEmail: userDetails.email,
      access_token: await this.jwtService.signAsync(userPayload),
    }
  }


  async verifyPassword(hashedPassword: string, plainPassword: string,): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (err) {
      console.log(err.message)
      return false;
    }
  }

  async signIn(payload: LoginDto, @Res() res: Response) {
    const { email, password } = payload;
    // const user = await this.userRepo.findOne({where:{email:email}  })
    const user = await this.userRepository.createQueryBuilder("user").addSelect("user.password").where("user.email = :email", { email: payload.email }).getOne()

    if (!user) {
      throw new HttpException('No email found', 400)
    }
    if (!user.password) {
      throw new HttpException('User password not found', 400);
    }
    const checkedPassword = await this.verifyPassword(user.password, password);
    if (!checkedPassword) {
      throw new HttpException('password incorrect', 400)
    }
    const token = await this.jwtService.signAsync({
      email: user.email,
      id: user.id,
      userName: user.userName,
      isBlocked: user.isBlocked,
      role: user.role

    });

    res.cookie('isAuthenticated', token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000
    });
    // delete user.password
    return res.send({
      success: true,
      userToken: token

    })
  }

  async findEmail(email: string) {
    const mail = await this.userRepository.findOneByOrFail({ email })
    if (!mail) {
      throw new UnauthorizedException()
    }
    return mail;
  }

  async user(headers: any): Promise<any> {
    const authorizationHeader = headers.authorization; //It tries to extract the authorization header from the incoming request headers. This header typically contains the token used for authentication.
    if (authorizationHeader) {
      const token = authorizationHeader.replace('Bearer ', '');
      const secret = process.env.JWTSECRET;
      //checks if the authorization header exists. If not, it will skip to the else block and throw an error.
      try {
        const decoded = this.jwtService.verify(token);
        let id = decoded["id"]; // After verifying the token, the function extracts the user's id from the decoded token payload.
        let user = await this.userRepository.findOneBy({ id });
        return { id: id, email: user?.email, role: user?.role };
      } catch (error) {
        throw new UnauthorizedException('Invalid token');

      }
    } else
      throw new UnauthorizedException('Invalid or missing Bearer token');

  }
}