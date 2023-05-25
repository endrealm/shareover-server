import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { prisma } from './const';
import { User } from '@prisma/client';


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
                token
            }
        })
        if(!user) {
            res.status(401);
            res.end();
            return;
        }

        req.user = user;
        next();
    }
}

