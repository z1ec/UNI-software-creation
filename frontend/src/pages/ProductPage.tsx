import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchProduct } from "../api/products";
import { addFavoriteApi, removeFavoriteApi } from "../api/favorites";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import type { ProductDetail } from "../types/product";

const CURRENCY = "₽";
const GENDER_LABELS: Record<string, string> = { M: "Мужское", F: "Женское", U: "Унисекс" };

function ProductPage() {
  const { productId } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [cartMsg, setCartMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchProduct(Number(productId), controller.signal);
        setProduct(data);
        setIsFav(data.is_in_favorites);
        setSelectedSize(data.sizes[0]?.size ?? "");
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Не удалось загрузить товар");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user) {
      setCartMsg("Войдите, чтобы добавить в корзину");
      return;
    }
    if (!selectedSize) {
      setCartMsg("Выберите размер");
      return;
    }
    try {
      await addItem(product!.id, selectedSize);
      setCartMsg("Добавлено в корзину!");
      setTimeout(() => setCartMsg(null), 2000);
    } catch {
      setCartMsg("Ошибка. Попробуйте снова.");
    }
  };

  const handleToggleFav = async () => {
    if (!user) return;
    setFavLoading(true);
    try {
      if (isFav) {
        await removeFavoriteApi(product!.id);
        setIsFav(false);
      } else {
        await addFavoriteApi(product!.id);
        setIsFav(true);
      }
    } finally {
      setFavLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="mx-auto min-h-[calc(100vh-160px)] w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid gap-10 rounded-[2rem] bg-white p-6 md:grid-cols-2 md:p-10">
              <div className="aspect-[4/5] rounded-[2rem] bg-[#f3eee8]" />
              <div className="space-y-4">
                <div className="h-4 w-24 rounded bg-black/10" />
                <div className="h-10 w-3/4 rounded bg-black/10" />
                <div className="h-20 w-full rounded bg-black/5" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <main className="mx-auto min-h-[calc(100vh-160px)] w-full max-w-4xl px-4 py-16 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-black/40">404</p>
          <h1 className="mt-4 text-4xl text-black">Товар не найден</h1>
          <Link
            to="/catalog"
            className="mt-8 inline-flex rounded-full border border-black px-6 py-3 text-sm uppercase tracking-[0.18em] text-black transition-colors hover:bg-black hover:text-white"
          >
            Вернуться в каталог
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const primaryImage = product.images[0] ?? "/product.png";
  const activeSize = selectedSize || product.sizes[0]?.size;
  const activeSizeStock = product.sizes.find((s) => s.size === activeSize)?.stock ?? 0;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-black/40">
          <Link to="/" className="hover:text-black">Главная</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-black">Каталог</Link>
          <span>/</span>
          <span className="text-black/70">{product.title}</span>
        </nav>

        <div className="grid gap-8 rounded-[2rem] bg-white p-6 md:grid-cols-2 md:p-10">
          {/* Images */}
          <div>
            <div className="rounded-[2rem] bg-[#f3eee8] p-6">
              <img
                src={primaryImage}
                alt={product.title}
                className="mx-auto h-full max-h-[520px] w-full object-contain"
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className="h-16 w-14 flex-shrink-0 overflow-hidden rounded-xl border-2 border-transparent transition-colors hover:border-black"
                  >
                    <img src={img} alt={`${product.title} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex h-full flex-col">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-black/45">{product.brand}</p>
              <h1 className="mt-3 text-4xl text-black sm:text-5xl">{product.title}</h1>

              {product.is_new && (
                <span className="mt-3 inline-flex rounded-full bg-eerie px-3 py-1 text-xs uppercase tracking-[0.16em] text-white">
                  Новинка
                </span>
              )}

              {product.description && (
                <p className="mt-4 text-base leading-relaxed text-black/65">{product.description}</p>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4 rounded-[1.5rem] bg-[#f7f3ee] p-5">
                {product.category && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-black/40">Категория</p>
                    <p className="mt-1 text-sm text-black">{product.category.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-black/40">Для кого</p>
                  <p className="mt-1 text-sm text-black">{GENDER_LABELS[product.gender] ?? product.gender}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-black/40">В наличии</p>
                  <p className="mt-1 text-sm text-black">{product.total_stock} шт.</p>
                </div>
                {product.discount && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-black/40">Скидка</p>
                    <p className="mt-1 text-sm text-green-600">−{product.discount}%</p>
                  </div>
                )}
              </div>

              {/* Sizes */}
              {product.sizes.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-black/40">Размер</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s.size}
                        type="button"
                        onClick={() => setSelectedSize(s.size)}
                        disabled={s.stock === 0}
                        className={`rounded-full border px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                          activeSize === s.size
                            ? "border-black bg-black text-white"
                            : "border-black/20 bg-white text-black hover:border-black"
                        }`}
                      >
                        {s.size}
                        {s.stock < 3 && s.stock > 0 && (
                          <span className="ml-1 text-xs text-black/40">({s.stock})</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {activeSize && activeSizeStock > 0 && activeSizeStock < 5 && (
                    <p className="mt-2 text-xs text-amber-600">Осталось мало: {activeSizeStock} шт.</p>
                  )}
                </div>
              )}
            </div>

            {/* Price & Actions */}
            <div className="mt-auto pt-8">
              <div className="flex flex-wrap items-end gap-3">
                <p className="text-4xl text-black">
                  {new Intl.NumberFormat("ru-RU").format(product.final_price)} {CURRENCY}
                </p>
                {product.discount && (
                  <p className="text-xl text-black/40 line-through">
                    {new Intl.NumberFormat("ru-RU").format(product.price)} {CURRENCY}
                  </p>
                )}
              </div>

              {cartMsg && (
                <p className={`mt-3 text-sm ${cartMsg.includes("!") ? "text-green-600" : "text-amber-600"}`}>
                  {cartMsg}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.total_stock === 0}
                  className="rounded-full bg-black px-6 py-3 text-sm uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85 disabled:opacity-40"
                >
                  {product.total_stock === 0 ? "Нет в наличии" : `В корзину${activeSize ? ` — ${activeSize}` : ""}`}
                </button>

                {user && (
                  <button
                    type="button"
                    onClick={handleToggleFav}
                    disabled={favLoading}
                    className="rounded-full border border-black px-6 py-3 text-sm uppercase tracking-[0.18em] text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50"
                  >
                    {isFav ? "В избранном ✓" : "В избранное"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ProductPage;
