import { api } from "./client";
import type { ProductListItem } from "../types/product";

export async function getFavoritesApi(): Promise<ProductListItem[]> {
  return api.get<ProductListItem[]>("/favorites");
}

export async function addFavoriteApi(product_id: number): Promise<void> {
  await api.post(`/favorites/${product_id}`);
}

export async function removeFavoriteApi(product_id: number): Promise<void> {
  await api.delete(`/favorites/${product_id}`);
}
