import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Product_card from "../components/ui/Product_card";
import { fetchProducts } from "../api/products";
import type { ProductListItem } from "../types/product";

const FALLBACK_IMAGE = "/product.png";
const CURRENCY = "₽";

function HomePage() {
    const [products, setProducts] = useState<ProductListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

                setError("Не удалось загрузить товары. Попробуйте обновить страницу.");
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
            <main className="mx-auto min-h-[calc(100vh-160px)] w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {isLoading && (
                    <p className="text-center text-lg text-[#5f5f5f]">Загружаем товары...</p>
                )}

                {!isLoading && error && (
                    <p className="text-center text-lg text-red-600">{error}</p>
                )}

                {!isLoading && !error && products.length === 0 && (
                    <p className="text-center text-lg text-[#5f5f5f]">Товары пока отсутствуют.</p>
                )}

                {!isLoading && !error && products.length > 0 && (
                    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {products.map((product) => (
                            <Product_card
                                key={product.id}
                                imageUrl={product.image ?? FALLBACK_IMAGE}
                                title={product.title}
                                category={product.type}
                                brand={product.brand}
                                price={product.price}
                                currency={CURRENCY}
                            />
                        ))}
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}

export default HomePage;
