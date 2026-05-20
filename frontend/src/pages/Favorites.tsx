import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getFavoritesApi, removeFavoriteApi } from "../api/favorites";
import { addToCartApi } from "../api/cart";
import { useCart } from "../context/CartContext";
import type { ProductListItem } from "../types/product";

const CURRENCY = "₽";
const FALLBACK = "/product.png";

function Favorites() {
  const { refresh: refreshCart } = useCart();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getFavoritesApi();
      setProducts(data);
    } catch {
      setError("Не удалось загрузить избранное");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleRemove = async (productId: number) => {
    setRemovingId(productId);
    try {
      await removeFavoriteApi(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (product: ProductListItem) => {
    const firstSize = product.total_stock > 0 ? "One Size" : "S";
    try {
      await addToCartApi(product.id, firstSize);
      await refreshCart();
    } catch {
      // ignore
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[calc(100vh-160px)] w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl text-black">Избранное</h1>

        {isLoading && <p className="mt-8 text-black/50">Загружаем избранное...</p>}
        {!isLoading && error && <p className="mt-8 text-red-600">{error}</p>}
        {!isLoading && !error && products.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-black/50">В избранном пусто</p>
            <Link
              to="/catalog"
              className="mt-6 inline-flex rounded-full border border-black px-6 py-3 text-sm uppercase tracking-[0.18em] text-black transition-colors hover:bg-black hover:text-white"
            >
              Перейти в каталог
            </Link>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="group relative rounded-[1.5rem] bg-white overflow-hidden">
                <Link to={`/catalog/${product.id}`} className="block">
                  <div className="aspect-[3/4] w-full overflow-hidden bg-[#f3eee8]">
                    <img
                      src={product.image ?? FALLBACK}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-black/45">{product.brand}</p>
                  <Link to={`/catalog/${product.id}`} className="mt-1 block text-base text-black hover:underline">
                    {product.title}
                  </Link>
                  <p className="mt-2 text-lg text-black">
                    {new Intl.NumberFormat("ru-RU").format(product.final_price)} {CURRENCY}
                    {product.discount && (
                      <span className="ml-2 text-sm text-black/40 line-through">
                        {new Intl.NumberFormat("ru-RU").format(product.price)}
                      </span>
                    )}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 rounded-full bg-black py-2 text-xs uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-85"
                    >
                      В корзину
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(product.id)}
                      disabled={removingId === product.id}
                      className="rounded-full border border-black/20 px-4 py-2 text-xs text-black/50 transition-colors hover:border-black hover:text-black disabled:opacity-40"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Favorites;
