import { Body, Controller, Get, Param, Put, Req } from "@nestjs/common";
import { z } from "zod";
import { prisma } from "../const";
import { v4 as uuidv4 } from "uuid";
import { GeoAPIService } from "../services/GeoAPIService";
import { Request } from "express";
import { get } from "http";

const UserCreateData = z.object({
    username: z.string(),
    password: z.string(),
    location: z.string(),
});
type UserCreateData = z.infer<typeof UserCreateData>;

@Controller("user")
export class UserController {
    constructor(private geoApi: GeoAPIService) {}

    @Get("me")
    me(@Req() req: Request): string {
        return req.user.id + "";
    }

    @Get(":id")
    async getUser(@Param() params) {
        const id = params.id;

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });

        return {
            id,
            location: user.location,
            username: user.name,
        }
    }

    @Put("create")
    async create(@Body() body: UserCreateData): Promise<string> {
        const data: UserCreateData = UserCreateData.parse(body);
        const token = await this.generateToken();
        const location = await this.geoApi.getLatLong(data.location);
        await prisma.user.create({
            data: {
                name: data.username,
                token: token,
                location: data.location,
                longitude: location.longitude,
                latitude: location.latitude,
            },
        });
        return token;
    }

    private async generateToken(): Promise<string> {
        let token: string;
        do {
            token = uuidv4();
        } while (await prisma.user.findUnique({ where: { token } }));
        return token;
    }
}
