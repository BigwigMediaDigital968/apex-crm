import { apiClient } from "./apiClient";
import type { Permission, Role } from "@/types/auth";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const permissionApi = {
  // GET /permissions -> all roles' permission maps
  getAll: async () => {
    const { data } = await apiClient.get<ApiEnvelope<Record<Role, Permission[]>>>(
      "/permissions"
    );
    return data.data;
  },
};