import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchProducts } from "../api/products";
import type { ProductListItem } from "../types/product";

const HERO_CARDS = [
    {
        id: "men",
        label: "Мужское",
        image: "/hero_section_man.png",
        to: "/catalog",
    },
    {
        id: "women",
        label: "Женское",
        image: "/hero_section_woman.png",
        to: "/catalog",
    },
] as const;

const FALLBACK_IMAGE = "/product.png";
const CURRENCY = "₽";

function HomePage() {
    const [products, setProducts] = useState<ProductListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const newProducts = useMemo(
        () => products.filter((product) => product.new),
        [products],
    );

    useEffect(() => {
        const controller = new AbortController();

        const loadProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const items = await fetchProducts(controller.signal);
                setProducts(items);
            } catch (loadError) {
                if (loadError instanceof DOMException && loadError.name === "AbortError") {
                    return;
                }

                setError("Не удалось загрузить новинки.");
            } finally {
                setIsLoading(false);
            }
        };

        void loadProducts();

        return () => {
            controller.abort();
        };
    }, []);

    return (
        <>
            <Header />
            <main className="bg-[#e9e9e9] py-8 sm:py-12">
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

                <section className="mx-auto mt-8 w-full max-w-7xl px-4 sm:mt-10 sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-2xl text-black sm:mb-6 sm:text-3xl">Новинки</h2>

                    {isLoading && (
                        <p className="text-base text-[#6d6d6d] sm:text-lg">Загружаем товары...</p>
                    )}

                    {!isLoading && error && (
                        <p className="text-base text-red-600 sm:text-lg">{error}</p>
                    )}

                    {!isLoading && !error && newProducts.length === 0 && (
                        <p className="text-base text-[#6d6d6d] sm:text-lg">Новинок пока нет.</p>
                    )}

                    {!isLoading && !error && newProducts.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {newProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    to="/catalog"
                                    className="group rounded-sm bg-[#f2f2f2] p-4 transition-transform duration-200 hover:-translate-y-0.5"
                                >
                                    <div className="aspect-[4/3] w-full">
                                        <img
                                            src={product.image ?? FALLBACK_IMAGE}
                                            alt={product.title}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <div className="mt-4 space-y-1 text-center">
                                        <p className="text-[32px] leading-none text-black">{product.brand}</p>
                                        <p className="text-[24px] leading-none text-[#8d8d8d]">{product.type}</p>
                                        <p className="text-[24px] leading-none text-[#8d8d8d]">{product.title}</p>
                                    </div>
                                    <p className="mt-4 text-center text-[34px] leading-none text-black">
                                        {new Intl.NumberFormat("ru-RU").format(product.price)} {CURRENCY}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}

export default HomePage;
