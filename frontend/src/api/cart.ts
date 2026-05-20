import { api } from "./client";
import type { Cart } from "../types/cart";

export async function getCartApi(): Promise<Cart> {
  return api.get<Cart>("/cart");
}

export async function addToCartApi(product_id: number, size: string, quantity = 1): Promise<Cart> {
  return api.post<Cart>("/cart", { product_id, size, quantity });
}

export async function updateCartItemApi(item_id: number, quantity: number): Promise<Cart> {
  return api.patch<Cart>(`/cart/${item_id}`, { quantity });
}

export async function removeCartItemApi(item_id: number): Promise<Cart> {
  return api.delete<Cart>(`/cart/${item_id}`);
}

export async function clearCartApi(): Promise<Cart> {
  return api.delete<Cart>("/cart");
}
