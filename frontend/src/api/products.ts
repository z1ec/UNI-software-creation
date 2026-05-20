import { api } from "./client";
import type { Category, ProductDetail, ProductsPage } from "../types/product";

type ProductFilters = {
  page?: number;
  limit?: number;
  category_id?: number;
  gender?: string;
  is_new?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
};

export async function fetchProducts(
  filters: ProductFilters = {},
  signal?: AbortSignal,
): Promise<ProductsPage> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      params.append(key, String(val));
    }
  });
  const query = params.toString() ? `?${params.toString()}` : "";
  return api.get<ProductsPage>(`/products${query}`, { signal, auth: false });
}

export async function fetchProduct(id: number, signal?: AbortSignal): Promise<ProductDetail> {
  return api.get<ProductDetail>(`/products/${id}`, { signal });
}

export async function fetchCategories(): Promise<Category[]> {
  return api.get<Category[]>("/categories", { auth: false });
}

export async function createProductApi(data: object): Promise<ProductDetail> {
  return api.post<ProductDetail>("/products", data);
}

export async function updateProductApi(id: number, data: object): Promise<ProductDetail> {
  return api.patch<ProductDetail>(`/products/${id}`, data);
}

export async function deleteProductApi(id: number): Promise<void> {
  return api.delete(`/products/${id}`);
}
