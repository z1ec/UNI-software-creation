import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }
    setIsLoading(true);
    try {
      await register({ email, full_name: fullName, password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ошибка регистрации. Попробуйте снова.");
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
            <h1 className="text-3xl text-black">Регистрация</h1>
            <p className="mt-2 text-sm text-black/50">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="text-black underline-offset-2 hover:underline">
                Войти
              </Link>
            </p>

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="fullName" className="block text-sm uppercase tracking-[0.16em] text-black/50">
                  Имя
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/15 bg-[#f7f3ee] px-4 py-3 text-black outline-none transition-colors focus:border-black"
                />
              </div>

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
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/15 bg-[#f7f3ee] px-4 py-3 text-black outline-none transition-colors focus:border-black"
                />
                <p className="mt-1 text-xs text-black/40">Минимум 6 символов</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full rounded-full bg-black py-3 text-sm uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                {isLoading ? "Регистрируемся..." : "Создать аккаунт"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Register;
