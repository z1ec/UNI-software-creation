import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ошибка входа. Попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
            <h1 className="text-3xl text-black">Войти</h1>
            <p className="mt-2 text-sm text-black/50">
              Нет аккаунта?{" "}
              <Link to="/register" className="text-black underline-offset-2 hover:underline">
                Зарегистрироваться
              </Link>
            </p>

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="block text-sm uppercase tracking-[0.16em] text-black/50">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/15 bg-[#f7f3ee] px-4 py-3 text-black outline-none transition-colors focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm uppercase tracking-[0.16em] text-black/50">
                  Пароль
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/15 bg-[#f7f3ee] px-4 py-3 text-black outline-none transition-colors focus:border-black"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full rounded-full bg-black py-3 text-sm uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                {isLoading ? "Входим..." : "Войти"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Login;
