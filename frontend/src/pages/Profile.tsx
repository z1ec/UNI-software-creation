import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { getOrdersApi } from "../api/orders";
import type { Order } from "../types/order";
import { ORDER_STATUS_LABELS } from "../types/order";

const CURRENCY = "₽";

function Profile() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.full_name ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getOrdersApi()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setIsLoadingOrders(false));
  }, []);

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    try {
      await api.patch("/users/me", { full_name: newName.trim() });
      setEditingName(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[calc(100vh-160px)] w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile card */}
          <div className="rounded-[2rem] bg-white p-6 lg:col-span-1 h-fit">
            <p className="text-xs uppercase tracking-[0.22em] text-black/40">Профиль</p>

            {editingName ? (
              <div className="mt-4">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-black/20 bg-[#f7f3ee] px-3 py-2 text-black outline-none focus:border-black"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveName}
                    disabled={isSaving}
                    className="flex-1 rounded-full bg-black py-2 text-sm text-white disabled:opacity-50"
                  >
                    {isSaving ? "Сохраняем..." : "Сохранить"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingName(false)}
                    className="rounded-full border border-black/20 px-4 py-2 text-sm text-black/60"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="mt-3 text-2xl text-black">{user.full_name}</h1>
                <button
                  type="button"
                  onClick={() => { setNewName(user.full_name); setEditingName(true); }}
                  className="mt-1 text-xs text-black/40 hover:text-black"
                >
                  Изменить имя
                </button>
              </>
            )}

            <p className="mt-3 text-sm text-black/50">{user.email}</p>

            <div className="mt-4 inline-flex rounded-full bg-[#f7f3ee] px-3 py-1 text-xs uppercase tracking-[0.14em] text-black/60">
              {user.role === "admin" ? "Администратор" : "Покупатель"}
            </div>

            <div className="mt-6 space-y-2 border-t border-black/10 pt-4">
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="block rounded-xl bg-[#f7f3ee] px-4 py-3 text-sm text-black transition-colors hover:bg-black/5"
                >
                  Панель администратора
                </Link>
              )}
              <Link
                to="/favorites"
                className="block rounded-xl bg-[#f7f3ee] px-4 py-3 text-sm text-black transition-colors hover:bg-black/5"
              >
                Избранное
              </Link>
              <Link
                to="/cart"
                className="block rounded-xl bg-[#f7f3ee] px-4 py-3 text-sm text-black transition-colors hover:bg-black/5"
              >
                Корзина
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-full rounded-xl px-4 py-3 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
              >
                Выйти
              </button>
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl text-black">Мои заказы</h2>

            {isLoadingOrders && <p className="mt-4 text-black/50">Загружаем заказы...</p>}

            {!isLoadingOrders && orders.length === 0 && (
              <div className="mt-6 rounded-[2rem] bg-white p-8 text-center">
                <p className="text-black/50">У вас ещё нет заказов</p>
                <Link
                  to="/catalog"
                  className="mt-4 inline-flex rounded-full border border-black px-5 py-2.5 text-sm uppercase tracking-[0.16em] text-black transition-colors hover:bg-black hover:text-white"
                >
                  За покупками
                </Link>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {orders.map((order) => (
                <article key={order.id} className="rounded-[1.5rem] bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-black/50">
                        Заказ #{order.id} · {new Date(order.created_at).toLocaleDateString("ru-RU")}
                      </p>
                      {order.delivery_address && (
                        <p className="mt-1 text-xs text-black/40">{order.delivery_address}</p>
                      )}
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.14em] ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-[#f7f3ee] text-black/60"
                    }`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image ?? "/product.png"}
                          alt={item.title}
                          className="h-12 w-10 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-black">{item.title}</p>
                          <p className="text-xs text-black/40">
                            Размер {item.size} · {item.quantity} шт.
                          </p>
                        </div>
                        <p className="text-sm text-black">
                          {new Intl.NumberFormat("ru-RU").format(item.subtotal)} {CURRENCY}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 border-t border-black/10 pt-3 text-right">
                    <span className="text-base text-black">
                      Итого: {new Intl.NumberFormat("ru-RU").format(order.total_amount)} {CURRENCY}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Profile;
