import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";

@Controller()
export class AppController {
  constructor(private readonly orders: OrdersService) {}

  @Get("health")
  health(): { status: string } {
    return { status: "ok" };
  }

  @Post("orders")
  createOrder(@Body() body: { item?: string; quantity?: number }) {
    return this.orders.create(body.item ?? "unknown", body.quantity ?? 1);
  }

  @Get("orders/:id")
  getOrder(@Param("id") id: string) {
    return this.orders.findOne(id);
  }
}
