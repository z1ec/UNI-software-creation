import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchProducts } from "../api/products";
import type { ProductListItem } from "../types/product";

const HERO_CARDS = [
  { id: "men", label: "Мужское", image: "/hero_section_man.png", to: "/catalog?gender=M" },
  { id: "women", label: "Женское", image: "/hero_section_woman.png", to: "/catalog?gender=F" },
] as const;

const CURRENCY = "₽";
const FALLBACK = "/product.png";

function HomePage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const newProducts = useMemo(() => products.filter((p) => p.is_new), [products]);

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts({ is_new: true, limit: 10 }, controller.signal)
      .then((data) => setProducts(data.items))
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Не удалось загрузить новинки.");
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <>
      <Header />
      <main className="bg-[#e9e9e9] py-8 sm:py-12">
        {/* Hero section */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {HERO_CARDS.map((card) => (
              <Link
                key={card.id}
                to={card.to}
                className="group block overflow-hidden rounded-sm p-3 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.label}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04] rounded-md"
                  />
                  <div className="absolute right-4 bottom-4 left-4 rounded-md bg-[#f2f2f2]/75 py-3 text-center text-[22px] leading-none text-black sm:text-[32px]">
                    {card.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New arrivals */}
        <section className="mx-auto mt-8 w-full max-w-7xl px-4 sm:mt-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-black sm:text-3xl">Новинки</h2>
            <Link
              to="/catalog?is_new=true"
              className="text-sm text-black/50 transition-colors hover:text-black"
            >
              Смотреть все →
            </Link>
          </div>

          {isLoading && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl bg-[#f2f2f2]">
                  <div className="aspect-[3/4] rounded-t-xl bg-black/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-16 rounded bg-black/5" />
                    <div className="h-4 w-3/4 rounded bg-black/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <p className="mt-6 text-red-600">{error}</p>
          )}

          {!isLoading && !error && newProducts.length === 0 && (
            <p className="mt-6 text-[#6d6d6d]">Новинок пока нет.</p>
          )}

          {!isLoading && !error && newProducts.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {newProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/catalog/${product.id}`}
                  className="group overflow-hidden rounded-xl bg-[#f2f2f2] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={product.image ?? FALLBACK}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="truncate text-xs uppercase tracking-[0.16em] text-black/45">{product.brand}</p>
                    <p className="mt-1 truncate text-sm text-black">{product.title}</p>
                    <div className="mt-2 flex items-end gap-1.5">
                      <p className="text-base font-medium text-black">
                        {new Intl.NumberFormat("ru-RU").format(product.final_price)} {CURRENCY}
                      </p>
                      {product.discount && (
                        <p className="text-xs text-black/40 line-through">
                          {new Intl.NumberFormat("ru-RU").format(product.price)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CTA Banner */}
        <section className="mx-auto mt-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-eerie px-8 py-12 text-center sm:py-16">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Atelier Collection</p>
            <h2 className="mt-4 font-serif text-3xl text-white sm:text-5xl">
              Откройте весь каталог
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
              Одежда, обувь и аксессуары для тех, кто ценит качество и стиль
            </p>
            <Link
              to="/catalog"
              className="mt-8 inline-flex rounded-full border border-white/30 px-8 py-3.5 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black"
            >
              Перейти в каталог
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
