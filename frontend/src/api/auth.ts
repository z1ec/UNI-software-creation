import { api } from "./client";
import type { LoginPayload, RegisterPayload, Tokens, User } from "../types/auth";

type AuthResponse = { user: User; tokens: Tokens };

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/login", payload, { auth: false });
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/register", payload, { auth: false });
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await api.post("/auth/logout", { refresh_token: refreshToken });
}

export async function getMeApi(): Promise<User> {
  return api.get<User>("/auth/me");
}
