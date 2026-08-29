import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

export interface Notification {
  id: string;
  to: string;
  message: string;
  status: "sent";
}

@Injectable()
export class NotificationsService {
  private readonly notifications = new Map<string, Notification>();
  private nextId = 1;

  send(to: string | undefined, message: string | undefined): Notification {
    if (!to || !message) {
      throw new BadRequestException("both 'to' and 'message' are required");
    }
    const notification: Notification = { id: String(this.nextId++), to, message, status: "sent" };
    this.notifications.set(notification.id, notification);
    return notification;
  }

  findOne(id: string): Notification {
    const notification = this.notifications.get(id);
    if (!notification) {
      throw new NotFoundException(`notification ${id} not found`);
    }
    return notification;
  }
}
