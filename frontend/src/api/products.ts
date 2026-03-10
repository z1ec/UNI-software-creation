import type { ProductListItem } from "../types/product";

const PRODUCTS_URL = "/api/products";

export async function fetchProducts(signal?: AbortSignal): Promise<ProductListItem[]> {
  const response = await fetch(PRODUCTS_URL, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const data: ProductListItem[] = await response.json();
  return data;
}
