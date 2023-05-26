import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
} from "@nestjs/common";
import { prisma } from "../const";
import { Request } from "express";
import { OfferDTO } from "../dto/OfferDTO";
import { z } from "zod";

const NotificationSettings = z.object({
    range: z.number(),
    categories: z.array(z.string()),
});

type NotificationSettings = z.infer<typeof NotificationSettings>;

@Controller("notification")
export class NotificationController {
    @Get("")
    public async getAll(
        @Query("since") since: string | undefined,
        @Req() request: Request
    ): Promise<OfferDTO[]> {
        let date = new Date(since);
        if (date.toString() === "Invalid Date") {
            date = new Date(0);
        }

        const results = await prisma.notification.findMany({
            where: {
                userId: request.user.id,
                createdAt: {
                    gte: date,
                },
            },
            include: {
                offer: true,
            },
        });

        return results.map(
            (result) =>
                ({
                    id: result.id.toString(),
                    ownerId: result.userId.toString(),
                    units: result.offer.units,
                    categoryId: result.offer.categoryId,
                    product: result.offer.product,
                    from: result.offer.from.toISOString(),
                    to: result.offer.to.toISOString(),
                } as OfferDTO)
        );
    }

    @Post()
    public async updateSettings(
        @Body() body: NotificationSettings,
        @Req() request: Request
    ) {
        const settings = NotificationSettings.parse(body);

        const parts = settings.categories.map(
            async (categoryId) =>
                await prisma.subscription.upsert({
                    where: {
                        userId_categoryId: {
                            userId: request.user.id,
                            categoryId: categoryId,
                        },
                    },
                    create: {
                        categoryId: categoryId,
                        userId: request.user.id,
                        latitude: request.user.latitude,
                        longitude: request.user.longitude,
                        radius: settings.range,
                    },
                    update: {
                        latitude: request.user.latitude,
                        longitude: request.user.longitude,
                        radius: settings.range,
                    },
                })
        );
        await Promise.all(parts);
    }

    @Delete()
    public async deleteAll(@Req() request: Request) {
        await prisma.notification.deleteMany({
            where: {
                userId: request.user.id,
            },
        });
    }

    @Delete(":id")
    public async deleteOne(
        @Req() request: Request,
        @Param() notificationId: string
    ) {
        const parser = z.preprocess(
            (a) => parseInt(z.string().parse(a), 10),
            z.number().positive()
        );

        const id = parser.parse(notificationId);

        await prisma.notification.deleteMany({
            where: {
                id: id,
                userId: request.user.id,
            },
        });
    }
}
