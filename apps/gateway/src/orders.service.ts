import { Injectable, NotFoundException } from "@nestjs/common";

export interface Order {
  id: string;
  item: string;
  quantity: number;
}

@Injectable()
export class OrdersService {
  private readonly orders = new Map<string, Order>();
  private nextId = 1;

  create(item: string, quantity: number): Order {
    const order: Order = { id: String(this.nextId++), item, quantity };
    this.orders.set(order.id, order);
    return order;
  }

  findOne(id: string): Order {
    const order = this.orders.get(id);
    if (!order) {
      throw new NotFoundException(`order ${id} not found`);
    }
    return order;
  }
}
