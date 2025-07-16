
import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

declare global {
    namespace Express {
        interface Request {
            currentUser?: User
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UserService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
            req.currentUser = undefined;
            next()
        } else {
            const token = authHeader.split(' ')[1];
            const jwtSecret = process.env.JWTSECRET;
            if (!jwtSecret) {
                throw new Error('JWT_SECRET is not defined');
            }
            const { id } = <jwtPayload>verify(token, jwtSecret)
            const currentUser = await this.userService.findOneById(id);
            req.currentUser=currentUser
            next();
        }

    }
}
interface jwtPayload {
    id: string;
}