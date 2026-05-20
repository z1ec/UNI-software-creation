export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type ProductSize = {
  size: string;
  stock: number;
};

export type ProductListItem = {
  id: number;
  title: string;
  brand: string;
  gender: string;
  category: Category | null;
  price: number;
  discount: number | null;
  final_price: number;
  is_new: boolean;
  image: string | null;
  total_stock: number;
};

export type ProductDetail = {
  id: number;
  title: string;
  description: string | null;
  brand: string;
  gender: string;
  category: Category | null;
  price: number;
  discount: number | null;
  final_price: number;
  is_new: boolean;
  images: string[];
  sizes: ProductSize[];
  total_stock: number;
  is_in_favorites: boolean;
  is_in_cart: boolean;
};

export type ProductsPage = {
  items: ProductListItem[];
  total: number;
  page: number;
  pages: number;
};
