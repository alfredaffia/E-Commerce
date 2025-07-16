import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(private  authService: AuthService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:configService.getOrThrow('JWTSECRET'),
    });
  }

  async validate(payload: {email}): Promise<User>{
    const {email} = payload;
    const user = await this.authService.findEmail(email)
    // console.log(user.email)
    if(!user){
        throw new UnauthorizedException('Login first to access this endpoint')
    }
    if (user.isBlocked === true) {
      throw new UnauthorizedException('User is blocked');
    }
    return user;
}
}


