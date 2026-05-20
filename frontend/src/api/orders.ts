import { api } from "./client";
import type { Order } from "../types/order";

export async function getOrdersApi(): Promise<Order[]> {
  return api.get<Order[]>("/orders");
}

export async function checkoutApi(delivery_address?: string): Promise<Order> {
  return api.post<Order>("/orders/checkout", { delivery_address });
}
