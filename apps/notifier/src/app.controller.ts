import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";

@Controller()
export class AppController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get("health")
  health(): { status: string } {
    return { status: "ok" };
  }

  @Post("notify")
  notify(@Body() body: { to?: string; message?: string }) {
    return this.notifications.send(body.to, body.message);
  }

  @Get("notifications/:id")
  getNotification(@Param("id") id: string) {
    return this.notifications.findOne(id);
  }
}
