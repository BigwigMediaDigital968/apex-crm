export const ROLES = {
  HEAD: "head",
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.HEAD]: "Head",
  [ROLES.ADMIN]: "Administrator",
  [ROLES.MANAGER]: "Manager",
  [ROLES.EMPLOYEE]: "Employee",
};

/**
 * Mirrors the backend's ROLE_HIERARCHY (roleHierarchy.ts) so the UI only ever
 * offers role choices the API will actually accept — the backend remains the
 * source of truth and re-validates on every request.
 */
export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  [ROLES.HEAD]: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  [ROLES.ADMIN]: [ROLES.MANAGER, ROLES.EMPLOYEE],
  [ROLES.MANAGER]: [ROLES.EMPLOYEE],
  [ROLES.EMPLOYEE]: [],
};

export const getAssignableRoles = (actorRole: Role): Role[] =>
  ROLE_HIERARCHY[actorRole] ?? [];

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  branches: string[];
  createdAt: string;
  updatedAt: string;
}

export type Permission = string;

export type PermissionsByRole = Record<Role, Permission[]>;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}