import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { checkoutApi } from "../api/orders";
import { ApiError } from "../api/client";

const CURRENCY = "₽";
const FALLBACK = "/product.png";

function Cart() {
  const { cart, isLoading, updateItem, removeItem, refresh } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      await checkoutApi(address || undefined);
      await refresh();
      navigate("/profile");
    } catch (err) {
      setCheckoutError(err instanceof ApiError ? err.message : "Ошибка оформления заказа");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[calc(100vh-160px)] w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl text-black">Корзина</h1>

        {isLoading && <p className="mt-8 text-black/50">Загружаем корзину...</p>}

        {!isLoading && (!cart || cart.items.length === 0) && (
          <div className="mt-12 text-center">
            <p className="text-lg text-black/50">Корзина пуста</p>
            <Link
              to="/catalog"
              className="mt-6 inline-flex rounded-full border border-black px-6 py-3 text-sm uppercase tracking-[0.18em] text-black transition-colors hover:bg-black hover:text-white"
            >
              Перейти в каталог
            </Link>
          </div>
        )}

        {!isLoading && cart && cart.items.length > 0 && (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cart.items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-[1.5rem] bg-white p-4 sm:p-5"
                >
                  <Link to={`/catalog/${item.product_id}`} className="shrink-0">
                    <img
                      src={item.image ?? FALLBACK}
                      alt={item.title}
                      className="h-24 w-20 rounded-lg object-cover sm:h-28 sm:w-24"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-black/45">{item.brand}</p>
                      <Link
                        to={`/catalog/${item.product_id}`}
                        className="mt-1 block text-lg text-black hover:underline"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-0.5 text-sm text-black/50">Размер: {item.size}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateItem(item.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-black/20 text-lg transition-colors hover:border-black"
                        >
                          −
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-black/20 text-lg transition-colors hover:border-black"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="text-lg font-medium text-black">
                          {new Intl.NumberFormat("ru-RU").format(item.subtotal)} {CURRENCY}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-black/40 transition-colors hover:text-black"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="rounded-[2rem] bg-white p-6 h-fit">
              <h2 className="text-xl text-black">Итого</h2>
              <div className="mt-4 space-y-2 text-sm text-black/60">
                <div className="flex justify-between">
                  <span>Товары ({cart.items_count})</span>
                  <span>{new Intl.NumberFormat("ru-RU").format(cart.total)} {CURRENCY}</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка</span>
                  <span className="text-green-600">Бесплатно</span>
                </div>
              </div>

              <div className="mt-4 border-t border-black/10 pt-4">
                <div className="flex justify-between text-lg text-black">
                  <span>К оплате</span>
                  <span>{new Intl.NumberFormat("ru-RU").format(cart.total)} {CURRENCY}</span>
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-xs uppercase tracking-[0.16em] text-black/50">
                  Адрес доставки
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Город, улица, дом"
                  className="mt-2 w-full rounded-xl border border-black/15 bg-[#f7f3ee] px-3 py-2.5 text-sm text-black outline-none focus:border-black"
                />
              </div>

              {checkoutError && (
                <p className="mt-3 text-sm text-red-600">{checkoutError}</p>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="mt-5 w-full rounded-full bg-black py-3 text-sm uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                {isCheckingOut ? "Оформляем..." : "Оформить заказ"}
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Cart;
