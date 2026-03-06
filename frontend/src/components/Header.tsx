import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type IconKey = "search" | "favorites" | "cart" | "profile";

type NavItem = {
    key: IconKey;
    to: string;
    label: string;
    icon: string;
};

type MenuItem = {
    label: string;
    to: string;
};

const NAV_ITEMS: NavItem[] = [
    { key: "favorites", to: "/favorites", label: "Избранное", icon: "/favorites.svg" },
    { key: "search", to: "/catalog", label: "Поиск", icon: "/search.svg" },
    { key: "cart", to: "/cart", label: "Корзина", icon: "/cart.svg" },
    { key: "profile", to: "/profile", label: "Личный кабинет", icon: "/profile.svg" },
];

const CENTER_MENU_ITEMS: MenuItem[] = [
    { label: "Новинки", to: "/catalog" },
    { label: "Бренды", to: "/catalog" },
    { label: "Мужское", to: "/catalog" },
    { label: "Женское", to: "/catalog" },
    { label: "Скидки", to: "/catalog" },
];

function Header() {
    const [isWideDesktop, setIsWideDesktop] = useState(false);
    const [isCompactHeader, setIsCompactHeader] = useState(false);
    const [showCompactMenu, setShowCompactMenu] = useState(false);
    const [isCompactExpanded, setIsCompactExpanded] = useState(false);
    const compactTimerRef = useRef<number | null>(null);

    useEffect(() => {
        const updateLayoutState = () => {
            const wideDesktop = window.innerWidth > 1400;
            setIsWideDesktop(wideDesktop);
            setIsCompactHeader(wideDesktop && window.scrollY > 70);
        };

        updateLayoutState();
        window.addEventListener("resize", updateLayoutState);
        window.addEventListener("scroll", updateLayoutState, { passive: true });

        return () => {
            window.removeEventListener("resize", updateLayoutState);
            window.removeEventListener("scroll", updateLayoutState);
        };
    }, []);

    useEffect(() => {
        if (compactTimerRef.current) {
            window.clearTimeout(compactTimerRef.current);
            compactTimerRef.current = null;
        }

        if (!isWideDesktop) {
            setShowCompactMenu(false);
            setIsCompactExpanded(false);
            return;
        }

        if (isCompactHeader) {
            setShowCompactMenu(true);
            setIsCompactExpanded(false);
            compactTimerRef.current = window.setTimeout(() => {
                setIsCompactExpanded(true);
            }, 120);
            return;
        }

        setIsCompactExpanded(false);
        compactTimerRef.current = window.setTimeout(() => {
            setShowCompactMenu(false);
        }, 220);
    }, [isCompactHeader, isWideDesktop]);

    useEffect(() => {
        return () => {
            if (compactTimerRef.current) {
                window.clearTimeout(compactTimerRef.current);
            }
        };
    }, []);

    return (
        <>
            <header className="border-b border-eerie/10 bg-white/95 backdrop-blur-sm">
                <div
                    className={`mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-500 sm:px-6 lg:px-8 ${
                        isWideDesktop && showCompactMenu
                            ? "pointer-events-none -translate-y-3 opacity-0"
                            : "translate-y-0 opacity-100"
                    }`}
                >
                    <Link
                        to="/"
                        className="shrink-0 font-serif text-2xl tracking-[0.18em] text-eerie uppercase transition-opacity hover:opacity-70"
                    >
                        Atelier
                    </Link>

                    <nav className="hidden items-center gap-6 min-[800px]:flex">
                        {CENTER_MENU_ITEMS.map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                className="relative text-sm tracking-wide text-eerie/70 transition-colors duration-300 hover:text-eerie after:absolute after:right-0 after:-bottom-1 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-eerie after:transition-transform after:duration-300 hover:after:scale-x-100"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <nav className="flex shrink-0 items-center gap-3 sm:gap-4">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.key}
                                to={item.to}
                                aria-label={item.label}
                                className="rounded-md p-1.5 transition-colors hover:bg-eerie/15"
                            >
                                <img src={item.icon} alt="" aria-hidden="true" className="h-6 w-6" />
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {isWideDesktop && (
                <div
                    className={`fixed top-4 left-1/2 z-[60] -translate-x-1/2 transition-all duration-300 ${
                        showCompactMenu ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                >
                    <nav
                        className={`flex items-center justify-center overflow-hidden rounded-full border border-eerie/10 bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-500 ${
                            isCompactExpanded ? "h-12 w-fit gap-4 px-5" : "h-12 w-12 gap-0 px-0"
                        }`}
                    >
                        <Link
                            to="/"
                            className={`font-serif text-base tracking-[0.14em] text-eerie uppercase transition-all duration-300 ${
                                isCompactExpanded
                                    ? "translate-y-0 opacity-100"
                                    : "pointer-events-none -translate-y-1 opacity-0"
                            }`}
                        >
                            Atelier
                        </Link>

                        <span
                            className={`text-eerie/30 transition-all duration-300 ${
                                isCompactExpanded
                                    ? "translate-y-0 opacity-100"
                                    : "pointer-events-none -translate-y-1 opacity-0"
                            }`}
                            aria-hidden="true"
                        >
                            |
                        </span>

                        <div className="flex items-center gap-4">
                            {CENTER_MENU_ITEMS.map((item) => (
                                <Link
                                    key={`compact-${item.label}`}
                                    to={item.to}
                                    className={`relative whitespace-nowrap text-sm tracking-wide text-eerie/70 transition-all duration-300 hover:text-eerie after:absolute after:right-0 after:-bottom-1 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-eerie after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                                        isCompactExpanded
                                            ? "translate-y-0 opacity-100"
                                            : "pointer-events-none -translate-y-1 opacity-0"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <span
                            className={`text-eerie/30 transition-all duration-300 ${
                                isCompactExpanded
                                    ? "translate-y-0 opacity-100"
                                    : "pointer-events-none -translate-y-1 opacity-0"
                            }`}
                            aria-hidden="true"
                        >
                            |
                        </span>

                        <div className="flex items-center gap-1">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={`compact-icon-${item.key}`}
                                    to={item.to}
                                    aria-label={item.label}
                                    className={`rounded-md p-1 transition-colors hover:bg-eerie/15 ${
                                        isCompactExpanded
                                            ? "translate-y-0 opacity-100"
                                            : "pointer-events-none -translate-y-1 opacity-0"
                                    }`}
                                >
                                    <img src={item.icon} alt="" aria-hidden="true" className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}

export default Header;
