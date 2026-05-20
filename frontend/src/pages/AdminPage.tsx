import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api } from "../api/client";
import { fetchProducts, deleteProductApi, updateProductApi } from "../api/products";
import type { ProductListItem } from "../types/product";
import { ORDER_STATUS_LABELS } from "../types/order";

type AdminUser = {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
};

type AdminOrder = {
  id: number;
  user_id: number;
  user_email: string;
  status: string;
  total_amount: number;
  created_at: string;
  items_count: number;
};

type Tab = "products" | "users" | "orders";

const CURRENCY = "₽";
const VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

function AdminPage() {
  const [tab, setTab] = useState<Tab>("products");

  // Products
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Users
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Orders
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Stats
  const totalStock = products.reduce((sum, p) => sum + p.total_stock, 0);
  const newCount = products.filter((p) => p.is_new).length;
  const discountCount = products.filter((p) => p.discount).length;

  useEffect(() => {
    fetchProducts({}, undefined)
      .then((data) => setProducts(data.items))
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, []);

  useEffect(() => {
    if (tab === "users" && users.length === 0) {
      setUsersLoading(true);
      api.get<AdminUser[]>("/admin/users")
        .then(setUsers)
        .catch(() => {})
        .finally(() => setUsersLoading(false));
    }
    if (tab === "orders" && orders.length === 0) {
      setOrdersLoading(true);
      api.get<AdminOrder[]>("/admin/orders")
        .then(setOrders)
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [tab]);

  const handleToggleNew = async (product: ProductListItem) => {
    try {
      await updateProductApi(product.id, { is_new: !product.is_new });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_new: !p.is_new } : p)),
      );
    } catch { /* ignore */ }
  };

  const handleToggleDiscount = async (product: ProductListItem) => {
    const newDiscount = product.discount ? null : 15;
    try {
      await updateProductApi(product.id, { discount: newDiscount });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, discount: newDiscount } : p)),
      );
    } catch { /* ignore */ }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm("Удалить товар?")) return;
    try {
      await deleteProductApi(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch { /* ignore */ }
  };

  const handleUserRole = async (userId: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "client" : "admin";
    try {
      const updated = await api.patch<AdminUser>(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    } catch { /* ignore */ }
  };

  const handleOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch { /* ignore */ }
  };

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[calc(100vh-160px)] w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-black/40">Панель управления</p>
          <h1 className="mt-2 text-3xl text-black">Администратор</h1>

          {/* Stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Товаров в каталоге", value: products.length },
              { label: "Новинок", value: newCount },
              { label: "Со скидкой", value: discountCount },
              { label: "Единиц на складе", value: totalStock },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[1.5rem] bg-[#f7f3ee] p-5">
                <p className="text-xs text-black/50">{stat.label}</p>
                <p className="mt-2 text-4xl text-black">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mt-8 flex gap-1 rounded-xl bg-[#f7f3ee] p-1">
            {(["products", "users", "orders"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2.5 text-sm transition-colors ${
                  tab === t ? "bg-white text-black shadow-sm" : "text-black/50 hover:text-black"
                }`}
              >
                {t === "products" ? "Товары" : t === "users" ? "Пользователи" : "Заказы"}
              </button>
            ))}
          </div>

          {/* Products tab */}
          {tab === "products" && (
            <div className="mt-6">
              <div className="mb-4 flex justify-end">
                <Link
                  to="/catalog"
                  className="rounded-full border border-black px-4 py-2 text-sm text-black hover:bg-black hover:text-white"
                >
                  + Добавить товар
                </Link>
              </div>
              {productsLoading && <p className="text-black/50">Загружаем товары...</p>}
              <div className="space-y-3">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="flex flex-col gap-4 rounded-[1.5rem] border border-black/10 p-5 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image ?? "/product.png"}
                        alt={product.title}
                        className="h-16 w-14 flex-shrink-0 rounded-xl object-cover"
                      />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-black/40">{product.brand}</p>
                        <Link
                          to={`/catalog/${product.id}`}
                          className="mt-0.5 block text-base text-black hover:underline"
                        >
                          {product.title}
                        </Link>
                        <p className="text-sm text-black/50">
                          {new Intl.NumberFormat("ru-RU").format(product.final_price)} {CURRENCY}
                          {product.discount && <span className="ml-2 text-green-600">−{product.discount}%</span>}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] ${
                            product.is_new ? "bg-black text-white" : "bg-black/5 text-black/50"
                          }`}>
                            {product.is_new ? "Новинка" : "Не новинка"}
                          </span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] ${
                            product.discount ? "bg-black text-white" : "bg-black/5 text-black/50"
                          }`}>
                            {product.discount ? `Скидка ${product.discount}%` : "Без скидки"}
                          </span>
                          <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] text-black/50">
                            Склад: {product.total_stock}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <button
                        type="button"
                        onClick={() => handleToggleNew(product)}
                        className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                          product.is_new
                            ? "border-black bg-black text-white"
                            : "border-black/30 text-black hover:border-black"
                        }`}
                      >
                        {product.is_new ? "Убрать из новинок" : "В новинки"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleDiscount(product)}
                        className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                          product.discount
                            ? "border-black bg-black text-white"
                            : "border-black/30 text-black hover:border-black"
                        }`}
                      >
                        {product.discount ? "Убрать скидку" : "Добавить скидку 15%"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="rounded-full border border-red-300 px-4 py-2 text-xs text-red-500 transition-colors hover:bg-red-50"
                      >
                        Удалить
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Users tab */}
          {tab === "users" && (
            <div className="mt-6">
              {usersLoading && <p className="text-black/50">Загружаем пользователей...</p>}
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-black/10 p-5"
                  >
                    <div>
                      <p className="text-base text-black">{user.full_name}</p>
                      <p className="text-sm text-black/50">{user.email}</p>
                      <span className={`mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] ${
                        user.role === "admin" ? "bg-black text-white" : "bg-black/5 text-black/50"
                      }`}>
                        {user.role === "admin" ? "Администратор" : "Покупатель"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUserRole(user.id, user.role)}
                      className="rounded-full border border-black/30 px-4 py-2 text-xs text-black transition-colors hover:border-black"
                    >
                      {user.role === "admin" ? "Сделать покупателем" : "Сделать администратором"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders tab */}
          {tab === "orders" && (
            <div className="mt-6">
              {ordersLoading && <p className="text-black/50">Загружаем заказы...</p>}
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-black/10 p-5"
                  >
                    <div>
                      <p className="text-base text-black">Заказ #{order.id}</p>
                      <p className="text-sm text-black/50">{order.user_email}</p>
                      <p className="mt-0.5 text-sm text-black/50">
                        {new Date(order.created_at).toLocaleDateString("ru-RU")} ·{" "}
                        {order.items_count} поз. ·{" "}
                        {new Intl.NumberFormat("ru-RU").format(order.total_amount)} {CURRENCY}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatus(order.id, e.target.value)}
                        className="rounded-xl border border-black/20 bg-[#f7f3ee] px-3 py-2 text-sm text-black outline-none focus:border-black"
                      >
                        {VALID_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {ORDER_STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminPage;
