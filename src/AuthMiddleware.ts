import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { prisma } from './const';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.header["token"];
        if(!token) {
            res.status(401);
            res.end();
            return;
        }

        const user = await prisma.user.findUnique({
            where: {
                token: "mytoken"
            }
        })
        console.log('Request...');
        console.log(user);
        next();
    }
}

