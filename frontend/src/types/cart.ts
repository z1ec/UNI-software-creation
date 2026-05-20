export type CartItem = {
  id: number;
  product_id: number;
  title: string;
  brand: string;
  image: string | null;
  price: number;
  discount: number | null;
  final_price: number;
  size: string;
  quantity: number;
  subtotal: number;
};

export type Cart = {
  items: CartItem[];
  total: number;
  items_count: number;
};
