import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addToCartApi,
  clearCartApi,
  getCartApi,
  removeCartItemApi,
  updateCartItemApi,
} from "../api/cart";
import type { Cart } from "../types/cart";
import { useAuth } from "./AuthContext";

type CartContextValue = {
  cart: Cart | null;
  cartCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
  addItem: (product_id: number, size: string, quantity?: number) => Promise<void>;
  updateItem: (item_id: number, quantity: number) => Promise<void>;
  removeItem: (item_id: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_CART: Cart = { items: [], total: 0, items_count: 0 };

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      setIsLoading(true);
      const data = await getCartApi();
      setCart(data);
    } catch {
      setCart(EMPTY_CART);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (product_id: number, size: string, quantity = 1) => {
      const data = await addToCartApi(product_id, size, quantity);
      setCart(data);
    },
    [],
  );

  const updateItem = useCallback(async (item_id: number, quantity: number) => {
    const data = await updateCartItemApi(item_id, quantity);
    setCart(data);
  }, []);

  const removeItem = useCallback(async (item_id: number) => {
    const data = await removeCartItemApi(item_id);
    setCart(data);
  }, []);

  const clearCart = useCallback(async () => {
    const data = await clearCartApi();
    setCart(data);
  }, []);

  const cartCount = cart?.items_count ?? 0;

  const value = useMemo(
    () => ({ cart, cartCount, isLoading, refresh, addItem, updateItem, removeItem, clearCart }),
    [cart, cartCount, isLoading, refresh, addItem, updateItem, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
