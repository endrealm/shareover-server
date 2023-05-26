import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
} from "@nestjs/common";
import { prisma } from "../const";
import { z } from "zod";
import "../types";
import { Request } from "express";
import { AppModule } from "src/app.module";

const OfferId = z.coerce.number();

const Offer = z.object({
    units: z.number(),
    categoryId: z.string(),
    product: z.string(),
    from: z.coerce.date(),
    to: z.coerce.date(),
});

type Offer = z.infer<typeof Offer>;

@Controller("offer")
export class OfferController {
    private async findOfferNear(
        latitude: number,
        longitude: number,
        radius: number
    ) {
        return await prisma.$queryRaw<
            { id: number }[]
        >`SELECT id FROM "Offer" WHERE ST_DWithin(ST_MakePoint(longitude, latitude), ST_MakePoint(${longitude}, ${latitude})::geography, ${radius})`;
    }

    private async findSubNear(
        latitude: number,
        longitude: number,
        radius: number,
        categoryId: string
    ) {
        return await prisma.$queryRaw<
            { userId: number; categoryId: string }[]
        >`SELECT userId, categoryId FROM "Subscription" WHERE ST_DWithin(ST_MakePoint(longitude, latitude), ST_MakePoint(${longitude}, ${latitude})::geography, ${radius}) AND categoryId=${categoryId}`;
    }

    @Get("list/nearby")
    async nearby(@Req() req: Request) {
        const user = req.user;

        const offers = await prisma.offer.findMany({
            where: {
                id: {
                    // 5 what? meters? kilometers???
                    in: (
                        await this.findOfferNear(
                            user.latitude,
                            user.longitude,
                            5
                        )
                    ).map(({ id }) => id),
                },
                units: {
                    gt: 0,
                },
            },
        });

        return offers.map((offer) => {
            return {
                id: offer.id,
                latitude: offer.latitude,
                longitude: offer.longitude,
                location: offer.location,
            };
        });
    }

    @Get("list/:id")
    async list(@Req() req: Request, @Param() params) {
        const id: number = OfferId.parse(params.id);
        const offers = await prisma.offer.findMany({
            where: {
                userId: id,
                units: {
                    gt: 0,
                },
            },
        });

        return offers.map((offer) => {
            return {
                id: offer.id,
                ownerId: offer.userId,
                units: offer.units,
                categoryId: offer.categoryId,
                product: offer.product,
                from: offer.from,
                to: offer.to,
            };
        });
    }

    @Post(":id")
    async claim(
        @Req() req: Request,
        @Param() params,
        @Query("amount") am: number
    ) {
        const id: number = OfferId.parse(params.id);
        const amount: number = z.coerce.number().positive().parse(am);

        await prisma.offer.update({
            where: {
                id,
            },
            data: {
                units: {
                    decrement: amount,
                },
            },
        });
    }

    @Put()
    async create(@Req() req: Request, @Body() body: Offer): Promise<number> {
        const input: Offer = Offer.parse(body);
        const user = req.user;
        const offer = await prisma.offer.create({
            data: {
                units: input.units,
                product: input.product,
                userId: user.id,
                latitude: user.latitude,
                longitude: user.longitude,
                location: user.location,
                from: input.from,
                to: input.to,
                categoryId: input.categoryId,
            },
        });

        const createdAt = new Date();

        const subsNear = await this.findSubNear(
            user.latitude,
            user.longitude,
            5,
            offer.categoryId
        );

        subsNear.forEach((sub) => {
            prisma.notification.create({
                data: {
                    userId: sub.userId,
                    offerId: offer.id,
                    createdAt,
                },
            });
        });

        return offer.id;
    }
}
