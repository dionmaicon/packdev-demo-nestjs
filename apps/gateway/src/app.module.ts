import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { OrdersService } from "./orders.service";

@Module({
  controllers: [AppController],
  providers: [OrdersService],
})
export class AppModule {}
