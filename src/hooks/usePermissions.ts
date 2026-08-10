import { useQuery } from "@tanstack/react-query";
import { permissionApi } from "@/services/permissionApi";
import { useAuthStore } from "@/store/auth.store";
import type { Permission } from "@/types/auth";

export const useRolePermissionsMap = () => {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  return useQuery({
    queryKey: ["permissions"],
    queryFn: permissionApi.getAll,
    enabled: isAuthenticated,
    staleTime: Infinity, // static per deployment, no need to refetch
  });
};

export const usePermissions = () => {
  const user = useAuthStore((s) => s.user);
  const { data: rolePermissionsMap, isLoading } = useRolePermissionsMap();
  console.log("rolePermissionsMap",rolePermissionsMap)
  console.log("user", user)

  const permissions: Permission[] =
    user && rolePermissionsMap ? rolePermissionsMap[user.role] ?? [] : [];

  const hasPermission = (permission: Permission) =>
    permissions.includes(permission);

  const hasAnyPermission = (perms: Permission[]) =>
    perms.some((p) => permissions.includes(p));

  const hasAllPermissions = (perms: Permission[]) =>
    perms.every((p) => permissions.includes(p));

  return {
    permissions,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};