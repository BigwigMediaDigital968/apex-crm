import { apiClient } from "./apiClient";
import type { AuthUser, LoginPayload, LoginResponse } from "@/types/auth";

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<ApiEnvelope<LoginResponse>>(
      "/auth/login",
      payload
    );
    return data.data;
  },

  me: async () => {
    const { data } = await apiClient.get<ApiEnvelope<{ user: AuthUser }>>(
      "/auth/me"
    );
    return data.data.user;
  },

  logout: async (refreshToken: string) => {
    await apiClient.post("/auth/logout", { refreshToken });
  },
};