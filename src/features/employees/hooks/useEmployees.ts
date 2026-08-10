import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { employeeApi } from "@/services/employeeApi";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type {
  CreateEmployeeInput,
  EmployeeListQuery,
  UpdateEmployeeInput,
} from "@/types/employee";

export const employeeKeys = {
  all: ["employees"] as const,
  list: (query: EmployeeListQuery) => [...employeeKeys.all, query] as const,
};

export const useEmployeesQuery = (query: EmployeeListQuery = {}) =>
  useQuery({
    queryKey: employeeKeys.list(query),
    queryFn: () => employeeApi.list(query),
    placeholderData: keepPreviousData,
  });

export const useEmployeeQuery = (id: string | undefined) =>
  useQuery({
    queryKey: ["employees", id],
    queryFn: () => employeeApi.getById(id as string),
    enabled: !!id,
  });

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeeInput) => employeeApi.create(payload),
    onSuccess: () => {
      toast.success("Employee onboarded successfully");
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to onboard employee"));
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEmployeeInput;
    }) => employeeApi.update(id, payload),
    onSuccess: () => {
      toast.success("Employee updated successfully");
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update employee"));
    },
  });
};

export const useUpdateEmployeeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      employeeApi.updateStatus(id, isActive),
    onSuccess: (employee) => {
      toast.success(
        employee.isActive
          ? "Employee activated successfully"
          : "Employee deactivated successfully"
      );
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update employee status"));
    },
  });
};

/**
 * Headcount per branch, for summary widgets (e.g. the Head dashboard).
 * Fetches one cheap count-only request per branch rather than pulling the
 * full employee list, so it stays fast regardless of workforce size.
 */
export const useEmployeeCountsByBranch = (branchIds: string[]) => {
  const results = useQueries({
    queries: branchIds.map((branchId) => ({
      queryKey: employeeKeys.list({ branchId, limit: 1 }),
      queryFn: () => employeeApi.list({ branchId, limit: 1 }),
      select: (res: Awaited<ReturnType<typeof employeeApi.list>>) =>
        res.pagination.total,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const counts: Record<string, number> = {};
  branchIds.forEach((id, i) => {
    if (results[i].data !== undefined) counts[id] = results[i].data as number;
  });

  return { counts, isLoading };
};

export const useUpdateEmployeeBranches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, branches }: { id: string; branches: string[] }) =>
      employeeApi.updateBranches(id, branches),
    onSuccess: () => {
      toast.success("Branch assignment updated successfully");
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update branch assignment"));
    },
  });
};
