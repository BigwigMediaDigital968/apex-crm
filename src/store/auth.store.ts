import { create } from "zustand";

export type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "TEAM_LEAD"
  | "SALES"
  | "HR";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

interface AuthStore {
  user: AuthUser | null;

  token: string | null;

  isAuthenticated: boolean;

  login: (user: AuthUser, token: string) => void;

  logout: () => void;

  updateUser: (user: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: {
    id: "1",
    name: "Demo Admin",
    email: "admin@crm.com",
    role: "ADMIN",
  },

  token: "demo-token",

  isAuthenticated: true,

  login: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),

  updateUser: (updatedUser) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            ...updatedUser,
          }
        : null,
    })),
}));