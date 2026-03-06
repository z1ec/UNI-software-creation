import { Link } from "react-router-dom";

type IconKey = "search" | "favorites" | "cart" | "profile";

type NavItem = {
    key: IconKey;
    to: string;
    label: string;
    icon: string;
};

const NAV_ITEMS: NavItem[] = [
    { key: "favorites", to: "/favorites", label: "Избранное", icon: "/favorites.svg" },
    { key: "search", to: "/catalog", label: "Поиск", icon: "/search.svg" },
    { key: "cart", to: "/cart", label: "Корзина", icon: "/cart.svg" },
    { key: "profile", to: "/profile", label: "Личный кабинет", icon: "/profile.svg" },
];

function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-eerie/10 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    to="/"
                    className="font-serif text-2xl tracking-[0.18em] text-eerie uppercase transition-opacity hover:opacity-70"
                >
                    Atelier
                </Link>

                <nav className="flex items-center gap-3 sm:gap-4">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.key}
                            to={item.to}
                            aria-label={item.label}
                            className="p-1 text-eerie transition-colors hover:text-gold"
                        >
                            <img src={item.icon} alt="" aria-hidden="true" className="h-6 w-6" />
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}

export default Header;
