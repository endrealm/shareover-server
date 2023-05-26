import { MiddlewareConsumer, Module } from "@nestjs/common";
import { UserController } from "./controllers/UserController";
import { AppService } from "./app.service";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { GeoAPIService } from "./services/GeoAPIService";
import { OfferController } from "./controllers/OfferController";
import { ConfigModule } from "@nestjs/config";
import { NotificationController } from "./controllers/NotificationController";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [".env", ".env.local"],
        }),
    ],
    controllers: [UserController, OfferController, NotificationController],
    providers: [AppService, GeoAPIService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).exclude("user/create").forRoutes("*");
    }
}
