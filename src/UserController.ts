import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOf, z } from "zod";
import { prisma } from './const';
import { v4 as uuidv4 } from 'uuid';

const UserCreateData = z.object({
    username: z.string(),
    password: z.string(),
    location: z.string()
})
type UserCreateData = z.infer<typeof UserCreateData>;

@Controller("user")
export class UserController {
    constructor(private readonly appService: AppService) {}

    @Get("me")
    me(@Req() req: Request): string {
        return "cool user";
    }

    @Put("create")
    async create(@Body() body: UserCreateData): Promise<string> {
        const data: UserCreateData = UserCreateData.parse(body); 
        const token = await this.generateToken();
        const user = await prisma.user.create({
            data:  {
                name: data.username,
                token: token,
                location: data.location
            }
        });
        return token;
    }

    private async generateToken(): Promise<string> {
        let token: string;
        do {
            token = uuidv4()
        } while(await prisma.user.findUnique({where: {token}}))
        return token;
    }

}
