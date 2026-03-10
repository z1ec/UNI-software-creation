type ProductCardProps = {
    imageUrl?: string;
    title?: string;
    category?: string;
    brand?: string;
    price?: number;
    currency?: string;
    onFavoriteClick?: () => void;
    onQuickViewClick?: () => void;
};

function Product_card({
    imageUrl = "/product.png",
    title = "Без названия",
    category = "Категория",
    brand = "Бренд",
    price = 0,
    currency = "₽",
    onFavoriteClick,
    onQuickViewClick,
}: ProductCardProps) {
    const formattedPrice = `${new Intl.NumberFormat("ru-RU").format(price)} ${currency}`;

    return (
        <article className="group relative w-full max-w-[560px] rounded-xl bg-[#f2f2f2] p-6 pb-10 text-center">
            <div className="pointer-events-none absolute top-8 right-8 flex flex-col gap-3 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                <button
                    type="button"
                    aria-label="Добавить в избранное"
                    onClick={onFavoriteClick}
                    className="cursor-pointer text-[#8a8a8a] transition-colors hover:text-[#5f5f5f]"
                >
                    <svg viewBox="0 0 24 24" className="h-10 w-10 fill-current" aria-hidden="true">
                        <path d="m12 1.8 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 16.7 6.1 19.8l1.2-6.5L2.5 8.7l6.6-.9L12 1.8Z" />
                    </svg>
                </button>

                <button
                    type="button"
                    aria-label="Быстрый просмотр"
                    onClick={onQuickViewClick}
                    className="cursor-pointer text-[#8a8a8a] transition-colors hover:text-[#5f5f5f]"
                >
                    <svg viewBox="0 0 24 24" className="h-10 w-10 fill-current" aria-hidden="true">
                        <path d="M10.5 2a8.5 8.5 0 1 0 5.4 15l4 4a1 1 0 0 0 1.4-1.4l-4-4A8.5 8.5 0 0 0 10.5 2Zm0 2a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Z" />
                    </svg>
                </button>
            </div>

            <img
                src={imageUrl}
                alt={title}
                className="mx-auto mt-4 h-auto w-full max-w-[420px] object-contain"
            />

            <div className="mt-8 space-y-3">
                <h3 className="text-[50px] leading-tight font-normal text-black md:text-[54px]">{title}</h3>
                <p className="text-[42px] leading-tight font-normal text-[#8d8d8d] md:text-[44px]">{category}</p>
                <p className="text-[42px] leading-tight font-normal text-[#8d8d8d] md:text-[44px]">{brand}</p>
            </div>

            <p className="mt-10 text-[54px] leading-tight font-normal text-black md:text-[58px]">{formattedPrice}</p>
        </article>
    );
}

export type { ProductCardProps };
export default Product_card;
