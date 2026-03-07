import { Link } from "react-router-dom";

type FooterLink = {
    label: string;
    to: string;
};

const FOOTER_LINKS: FooterLink[] = [
    { label: "Главная", to: "/" },
    { label: "Новинки", to: "/catalog" },
    { label: "Бренды", to: "/catalog" },
    { label: "Мужское", to: "/catalog" },
    { label: "Женское", to: "/catalog" },
    { label: "Скидки", to: "/catalog" },
    { label: "Избранное", to: "/favorites" },
    { label: "Поиск", to: "/catalog" },
    { label: "Корзина", to: "/cart" },
    { label: "Личный кабинет", to: "/profile" },
];

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-eerie">
            <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    <Link
                        to="/"
                        className="font-serif text-2xl tracking-[0.18em] text-white uppercase transition-opacity hover:opacity-70"
                    >
                        Atelier
                    </Link>

                    <nav className="grid w-full max-w-3xl grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
                    {FOOTER_LINKS.map((item) => (
                        <Link
                            key={`${item.label}-${item.to}`}
                            to={item.to}
                            className="text-sm text-white/85 transition-colors hover:text-white"
                        >
                            {item.label}
                        </Link>
                    ))}
                    </nav>
                </div>

                <div className="mt-8 border-t border-white/15 pt-5">
                    <p className="text-sm text-white/70">Atelier - все права защищены {year}</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
