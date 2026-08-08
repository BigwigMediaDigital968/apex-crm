import { apiClient } from "./apiClient";
import type { ApiEnvelope, PaginatedApiEnvelope } from "./apiEnvelope";
import type {
  CreateEmployeeInput,
  Employee,
  EmployeeListQuery,
  EmployeeMutationResult,
  Pagination,
  UpdateEmployeeInput,
} from "@/types/employee";

export const employeeApi = {
  list: async (query: EmployeeListQuery = {}) => {
    const { data } = await apiClient.get<PaginatedApiEnvelope<Employee>>(
      "/users",
      { params: query }
    );
    return { employees: data.data, pagination: data.pagination as Pagination };
  },

  create: async (payload: CreateEmployeeInput) => {
    const { data } = await apiClient.post<ApiEnvelope<EmployeeMutationResult>>(
      "/users",
      payload
    );
    return data.data;
  },

  update: async (id: string, payload: UpdateEmployeeInput) => {
    const { data } = await apiClient.patch<ApiEnvelope<EmployeeMutationResult>>(
      `/users/${id}`,
      payload
    );
    return data.data;
  },

  updateStatus: async (id: string, isActive: boolean) => {
    const { data } = await apiClient.patch<ApiEnvelope<EmployeeMutationResult>>(
      `/users/${id}/status`,
      { isActive }
    );
    return data.data;
  },

  updateBranches: async (id: string, branches: string[]) => {
    const { data } = await apiClient.patch<ApiEnvelope<EmployeeMutationResult>>(
      `/users/${id}/branches`,
      { branches }
    );
    return data.data;
  },
};
