import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchCategories, fetchProducts } from "../api/products";
import { addFavoriteApi, removeFavoriteApi } from "../api/favorites";
import { useAuth } from "../context/AuthContext";
import type { Category, ProductListItem } from "../types/product";

const CURRENCY = "₽";
const FALLBACK = "/product.png";

const GENDER_OPTIONS = [
  { value: "", label: "Все" },
  { value: "M", label: "Мужское" },
  { value: "F", label: "Женское" },
  { value: "U", label: "Унисекс" },
];

function Catalog() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const searchValue = searchParams.get("search") ?? "";
  const gender = searchParams.get("gender") ?? "";
  const categoryId = searchParams.get("category_id") ?? "";
  const isNew = searchParams.get("is_new") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(searchValue);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const loadProducts = useCallback(async () => {
    const controller = new AbortController();
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchProducts(
        {
          page,
          limit: 12,
          search: searchValue || undefined,
          gender: gender || undefined,
          category_id: categoryId ? Number(categoryId) : undefined,
          is_new: isNew === "true" ? true : undefined,
        },
        controller.signal,
      );
      setProducts(data.items);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("Не удалось загрузить товары");
    } finally {
      setIsLoading(false);
    }
    return () => controller.abort();
  }, [page, searchValue, gender, categoryId, isNew]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete("page");
    setSearchParams(next);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setParam("search", inputValue.trim());
  };

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFav = async (productId: number) => {
    if (!user) return;
    if (favorites.has(productId)) {
      await removeFavoriteApi(productId).catch(() => {});
      setFavorites((prev) => { const s = new Set(prev); s.delete(productId); return s; });
    } else {
      await addFavoriteApi(productId).catch(() => {});
      setFavorites((prev) => new Set(prev).add(productId));
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[calc(100vh-160px)] w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar filters */}
          <aside className="w-full shrink-0 lg:w-60">
            <div className="rounded-[1.5rem] bg-white p-5">
              <h2 className="text-xs uppercase tracking-[0.22em] text-black/40">Фильтры</h2>

              {/* Search */}
              <form onSubmit={handleSearch} className="mt-4">
                <div className="flex gap-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Поиск..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-black/15 bg-[#f7f3ee] px-3 py-2 text-sm outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-black px-3 py-2 text-sm text-white"
                  >
                    →
                  </button>
                </div>
              </form>

              {/* Gender */}
              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.16em] text-black/40">Пол</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {GENDER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setParam("gender", opt.value)}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        gender === opt.value
                          ? "border-black bg-black text-white"
                          : "border-black/20 text-black/70 hover:border-black"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-black/40">Категория</p>
                  <div className="mt-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => setParam("category_id", "")}
                      className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                        !categoryId ? "bg-black text-white" : "text-black/70 hover:bg-black/5"
                      }`}
                    >
                      Все категории
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setParam("category_id", String(cat.id))}
                        className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                          categoryId === String(cat.id) ? "bg-black text-white" : "text-black/70 hover:bg-black/5"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* New only */}
              <div className="mt-5">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isNew === "true"}
                    onChange={(e) => setParam("is_new", e.target.checked ? "true" : "")}
                    className="h-4 w-4 accent-black"
                  />
                  <span className="text-sm text-black/70">Только новинки</span>
                </label>
              </div>

              {/* Reset */}
              {(gender || categoryId || isNew || searchValue) && (
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="mt-5 w-full rounded-full border border-black/20 py-2 text-xs text-black/50 transition-colors hover:border-black hover:text-black"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-black/50">
                {isLoading ? "Загружаем..." : `${total} товаров`}
              </p>
            </div>

            {error && <p className="text-center text-lg text-red-600">{error}</p>}

            {!isLoading && !error && products.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-lg text-black/50">Товары не найдены</p>
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="mt-4 rounded-full border border-black px-5 py-2 text-sm text-black hover:bg-black hover:text-white"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {(isLoading ? Array.from({ length: 6 }) : products).map((product, i) => {
                if (!product) {
                  return (
                    <div key={i} className="animate-pulse rounded-[1.5rem] bg-white">
                      <div className="aspect-[3/4] rounded-t-[1.5rem] bg-black/5" />
                      <div className="p-4 space-y-2">
                        <div className="h-3 w-16 rounded bg-black/5" />
                        <div className="h-5 w-3/4 rounded bg-black/5" />
                        <div className="h-5 w-1/2 rounded bg-black/5" />
                      </div>
                    </div>
                  );
                }
                const p = product as ProductListItem;
                return (
                  <article key={p.id} className="group relative overflow-hidden rounded-[1.5rem] bg-white">
                    <Link to={`/catalog/${p.id}`} className="block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#f3eee8]">
                        <img
                          src={p.image ?? FALLBACK}
                          alt={p.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        {p.is_new && (
                          <span className="absolute top-3 left-3 rounded-full bg-black px-2.5 py-1 text-[10px] uppercase tracking-widest text-white">
                            New
                          </span>
                        )}
                        {p.discount && (
                          <span className="absolute top-3 right-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] uppercase text-white">
                            −{p.discount}%
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-black/40">{p.brand}</p>
                      <Link to={`/catalog/${p.id}`} className="mt-1 block text-base text-black hover:underline">
                        {p.title}
                      </Link>
                      {p.category && (
                        <p className="text-xs text-black/40">{p.category.name}</p>
                      )}
                      <div className="mt-2 flex items-end gap-2">
                        <p className="text-lg text-black">
                          {new Intl.NumberFormat("ru-RU").format(p.final_price)} {CURRENCY}
                        </p>
                        {p.discount && (
                          <p className="text-sm text-black/40 line-through">
                            {new Intl.NumberFormat("ru-RU").format(p.price)}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Link
                          to={`/catalog/${p.id}`}
                          className="flex-1 rounded-full bg-black py-2 text-center text-xs uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-85"
                        >
                          Подробнее
                        </Link>
                        {user && (
                          <button
                            type="button"
                            onClick={() => toggleFav(p.id)}
                            className={`rounded-full border px-3 py-2 text-xs transition-colors ${
                              favorites.has(p.id)
                                ? "border-black bg-black text-white"
                                : "border-black/20 text-black/50 hover:border-black"
                            }`}
                          >
                            ♥
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="rounded-full border border-black/20 px-4 py-2 text-sm text-black disabled:opacity-30 hover:border-black"
                >
                  ←
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={`h-9 w-9 rounded-full text-sm transition-colors ${
                      p === page ? "bg-black text-white" : "border border-black/20 text-black hover:border-black"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= pages}
                  className="rounded-full border border-black/20 px-4 py-2 text-sm text-black disabled:opacity-30 hover:border-black"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Catalog;
