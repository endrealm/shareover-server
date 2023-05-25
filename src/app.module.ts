import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './UserController';
import { AppService } from './app.service';
import { AuthMiddleware } from './AuthMiddleware';

@Module({
    imports: [],
    controllers: [UserController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude("user/create")
            .forRoutes("*")
    }
}
