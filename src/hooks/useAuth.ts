import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authApi } from "@/services/authApi";
import { useAuthStore } from "@/store/auth.store";
import type { LoginPayload } from "@/types/auth";

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);

  return {
    user,
    isAuthenticated: !!accessToken && !!user,
    isBootstrapping,
  };
};

export const useLogin = () => {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setSession(data.user, data.accessToken, data.refreshToken);
      navigate("/dashboard", { replace: true });
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { refreshToken } = useAuthStore.getState();
      if (refreshToken) {
        await authApi.logout(refreshToken).catch(() => {
          // clear locally regardless of network/server outcome
        });
      }
    },
    onSettled: () => {
      useAuthStore.getState().clearSession();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
};