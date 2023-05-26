import { Body, Controller, Get, Param, Post, Put, Req } from "@nestjs/common";
import { prisma } from "../const";
import { z } from "zod";
import "../types"
import { Request } from "express";

const OfferId = z.number();

const Ofer = z.object({
    units: z.number(),
    categoryId: z.string(),
    product: z.string(),
    from: z.date(),
    to: z.date()
})

type Offer = z.infer<typeof Ofer>

@Controller("offer")
export class OfferController {

    @Get("list/nearby")
    nearby(@Req() req: Request) {

    }

    @Get("list/:id")
    list(@Req() req: Request, @Param() params) {
        const id: number = OfferId.parse(params.id);

    }

    @Post(":id")
    claim(@Req() req: Request, @Param() params) {
        const id: number = OfferId.parse(params.id);
    }

    @Put()
    async create(@Req() req: Request, @Body() body: Offer): Promise<number> {
        const input: Offer = Ofer.parse(body);
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
                categoryId: input.categoryId
            }
        })
        return offer.id;
    }

}