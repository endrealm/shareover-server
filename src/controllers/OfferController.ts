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
    @Get("list/nearby")
    nearby(@Req() req: Request) {}

    @Get("list/:id")
    list(@Req() req: Request, @Param() params) {
        const id: number = OfferId.parse(params.id);
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
        return offer.id;
    }
}
