import { apiClient } from "./apiClient";
import type { AuthUser, LoginPayload, LoginResponse } from "@/types/auth";

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface LateCheckInPayload {
  userId: string;
  reason: string;
}

export interface LateCheckInResponseData {
  _id: string;
  employee: string;
  branch: string;
  requestDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
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

export const lateCheckInApi = {
  submitReason: async (payload: LateCheckInPayload) => {
    const { data } = await apiClient.post<ApiEnvelope<LateCheckInResponseData>>(
      "/late-checkin/submit-reason",
      payload
    );
    return data.data;
  },
};