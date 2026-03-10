import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

function HomePage() {
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
            </main>
            <Footer />
        </>
    );
}

export default HomePage;
