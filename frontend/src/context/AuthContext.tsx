import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMeApi, loginApi, logoutApi, registerApi } from "../api/auth";
import { clearTokens, saveTokens } from "../api/client";
import type { LoginPayload, RegisterPayload, User } from "../types/auth";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    getMeApi()
      .then(setUser)
      .catch(() => clearTokens())
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { user, tokens } = await loginApi(payload);
    saveTokens(tokens.access_token, tokens.refresh_token);
    setUser(user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { user, tokens } = await registerApi(payload);
    saveTokens(tokens.access_token, tokens.refresh_token);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    const rt = localStorage.getItem("refresh_token") ?? "";
    try {
      if (rt) await logoutApi(rt);
    } catch {
      // ignore errors on logout
    }
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
