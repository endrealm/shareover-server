import { MiddlewareConsumer, Module } from "@nestjs/common";
import { UserController } from "./controllers/UserController";
import { AppService } from "./app.service";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { GeoAPIService } from "./services/GeoAPIService";
import { OfferController } from "./controllers/OfferController";

@Module({
    imports: [],
    controllers: [UserController, OfferController],
    providers: [AppService, GeoAPIService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).exclude("user/create").forRoutes("*");
    }
}
