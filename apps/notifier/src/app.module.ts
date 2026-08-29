import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { NotificationsService } from "./notifications.service";

@Module({
  controllers: [AppController],
  providers: [NotificationsService],
})
export class AppModule {}
