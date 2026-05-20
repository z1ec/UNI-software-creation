export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  id: number;
  product_id: number;
  title: string;
  brand: string;
  image: string | null;
  size: string;
  quantity: number;
  price_at_order: number;
  subtotal: number;
};

export type Order = {
  id: number;
  status: OrderStatus;
  total_amount: number;
  delivery_address: string | null;
  created_at: string;
  items: OrderItem[];
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Ожидает подтверждения",
  confirmed: "Подтверждён",
  shipped: "В доставке",
  delivered: "Доставлен",
  cancelled: "Отменён",
};
