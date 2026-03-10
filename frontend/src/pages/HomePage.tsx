import Header from "../components/Header";
import Footer from "../components/Footer";
import Product_card from "../components/ui/Product_card";

function HomePage() {
    return (
        <>
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-7xl items-start justify-center px-4 py-10 sm:px-6 lg:px-8">
            <Product_card />
        </main>
        <Footer />
        </>
    )
}

export default HomePage
