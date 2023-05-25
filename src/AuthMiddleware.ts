import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { prisma } from './const';
import { User } from '@prisma/client';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const tokenRaw = req.header("Authorization") as string;
        if(!tokenRaw) {
            res.status(401);
            res.end();
            return;
        }

        const token = tokenRaw.substring(7, tokenRaw.length);
        const user = await prisma.user.findUnique({
            where: {
                token: token
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

