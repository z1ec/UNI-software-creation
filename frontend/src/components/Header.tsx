import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

type MenuItem = { label: string; to: string };

const CENTER_MENU_ITEMS: MenuItem[] = [
  { label: "Новинки", to: "/catalog?is_new=true" },
  { label: "Мужское", to: "/catalog?gender=M" },
  { label: "Женское", to: "/catalog?gender=F" },
  { label: "Скидки", to: "/catalog" },
];

function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-eerie text-[10px] text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}

function Header() {
  const { user } = useAuth();
  const { cartCount } = useCart();

  const [viewportWidth, setViewportWidth] = useState(0);
  const [showCompactMenu, setShowCompactMenu] = useState(false);
  const [isCompactExpanded, setIsCompactExpanded] = useState(false);
  const isCompactHeaderRef = useRef(false);
  const compactTimerRef = useRef<number | null>(null);

  const isDesktopMenu = viewportWidth >= 800;
  const isVerySmallMobile = viewportWidth < 540;
  const isMidDesktop = viewportWidth >= 800 && viewportWidth < 1400;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const clearCompactTimer = () => {
      if (compactTimerRef.current) {
        window.clearTimeout(compactTimerRef.current);
        compactTimerRef.current = null;
      }
    };

    const applyCompactState = (nextCompact: boolean) => {
      clearCompactTimer();
      if (nextCompact) {
        setShowCompactMenu(true);
        setIsCompactExpanded(false);
        compactTimerRef.current = window.setTimeout(() => setIsCompactExpanded(true), 120);
        return;
      }
      setIsCompactExpanded(false);
      compactTimerRef.current = window.setTimeout(() => setShowCompactMenu(false), 220);
    };

    const updateLayoutState = () => {
      setViewportWidth(window.innerWidth);
      const nextCompact = window.scrollY > 70;
      if (isCompactHeaderRef.current !== nextCompact) {
        isCompactHeaderRef.current = nextCompact;
        applyCompactState(nextCompact);
      }
    };

    updateLayoutState();
    window.addEventListener("resize", updateLayoutState);
    window.addEventListener("scroll", updateLayoutState, { passive: true });
    return () => {
      window.removeEventListener("resize", updateLayoutState);
      window.removeEventListener("scroll", updateLayoutState);
      clearCompactTimer();
    };
  }, []);

  const NavIcons = ({ compact = false }: { compact?: boolean }) => (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-3 sm:gap-4"}`}>
      <Link
        to="/catalog"
        aria-label="Поиск"
        onClick={scrollToTop}
        className={`shrink-0 rounded-md transition-colors hover:bg-eerie/15 ${compact ? (isVerySmallMobile ? "p-0.5" : "p-1") : "p-1.5"} ${compact && !isCompactExpanded ? "pointer-events-none -translate-y-1 opacity-0" : ""}`}
      >
        <img src="/search.svg" alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
      </Link>

      <Link
        to="/favorites"
        aria-label="Избранное"
        onClick={scrollToTop}
        className={`shrink-0 rounded-md transition-colors hover:bg-eerie/15 ${compact ? (isVerySmallMobile ? "p-0.5" : "p-1") : "p-1.5"} ${compact && !isCompactExpanded ? "pointer-events-none -translate-y-1 opacity-0" : ""}`}
      >
        <img src="/favorites.svg" alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
      </Link>

      <Link
        to="/cart"
        aria-label="Корзина"
        onClick={scrollToTop}
        className={`relative shrink-0 rounded-md transition-colors hover:bg-eerie/15 ${compact ? (isVerySmallMobile ? "p-0.5" : "p-1") : "p-1.5"} ${compact && !isCompactExpanded ? "pointer-events-none -translate-y-1 opacity-0" : ""}`}
      >
        <img src="/cart.svg" alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
        <CartBadge count={cartCount} />
      </Link>

      {user ? (
        <div className={`flex items-center gap-2 ${compact && !isCompactExpanded ? "pointer-events-none opacity-0" : ""}`}>
          {user.role === "admin" && (
            <Link
              to="/admin"
              onClick={scrollToTop}
              className={`hidden rounded-full border border-eerie/30 px-3 py-1 text-xs uppercase tracking-widest text-eerie/70 transition-colors hover:border-eerie hover:text-eerie min-[800px]:block`}
            >
              Admin
            </Link>
          )}
          <Link
            to="/profile"
            aria-label="Профиль"
            onClick={scrollToTop}
            className={`shrink-0 rounded-md transition-colors hover:bg-eerie/15 ${compact ? (isVerySmallMobile ? "p-0.5" : "p-1") : "p-1.5"}`}
          >
            <img src="/profile.svg" alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
          </Link>
        </div>
      ) : (
        <Link
          to="/login"
          onClick={scrollToTop}
          className={`shrink-0 rounded-md transition-colors hover:bg-eerie/15 ${compact ? (isVerySmallMobile ? "p-0.5" : "p-1") : "p-1.5"} ${compact && !isCompactExpanded ? "pointer-events-none -translate-y-1 opacity-0" : ""}`}
        >
          <img src="/profile.svg" alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
        </Link>
      )}
    </div>
  );

  return (
    <>
      <header className="w-full border-b border-eerie/10 bg-white/95 backdrop-blur-sm">
        <div
          className={`mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-500 sm:px-6 lg:px-8 ${
            showCompactMenu
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

          <NavIcons />
        </div>
      </header>

      <div
        className={`fixed top-4 left-1/2 z-[60] -translate-x-1/2 transition-all duration-300 ${
          showCompactMenu ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          className={`inline-flex items-center justify-center overflow-hidden rounded-full border border-eerie/10 bg-white/75 shadow-sm backdrop-blur-sm transition-all duration-500 ${
            isCompactExpanded
              ? isDesktopMenu
                ? isMidDesktop
                  ? "h-12 w-max gap-2 px-3"
                  : "h-12 w-max gap-4 px-6"
                : isVerySmallMobile
                  ? "h-11 w-max gap-1.5 px-2"
                  : "h-12 w-max gap-2 px-3"
              : "h-12 w-12 gap-0 px-0"
          }`}
        >
          <Link
            to="/"
            onClick={scrollToTop}
            className={`font-serif uppercase text-eerie transition-all duration-300 ${
              isVerySmallMobile ? "text-base tracking-[0.11em]" : "text-base tracking-[0.14em]"
            } ${
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

          {isDesktopMenu && (
            <>
              <div className={`flex items-center ${isMidDesktop ? "gap-2" : "gap-4"}`}>
                {CENTER_MENU_ITEMS.map((item) => (
                  <Link
                    key={`compact-${item.label}`}
                    to={item.to}
                    onClick={scrollToTop}
                    className={`relative whitespace-nowrap text-eerie/70 transition-all duration-300 hover:text-eerie after:absolute after:right-0 after:-bottom-1 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-eerie after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                      isMidDesktop ? "text-xs tracking-normal" : "text-sm tracking-wide"
                    } ${
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
            </>
          )}

          <NavIcons compact />
        </nav>
      </div>
    </>
  );
}

export default Header;
