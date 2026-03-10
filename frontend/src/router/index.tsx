import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Catalog from "../pages/Catalog";
import Cart from "../pages/Cart";
import Favorites from "../pages/Favorites";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
