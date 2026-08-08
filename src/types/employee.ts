import type { Role } from "./auth";
import type { BranchRef } from "./branch";

export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: Role;
  branches: BranchRef[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeListQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  branchId?: string;
  isActive?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  branches?: string[];
}

export interface UpdateEmployeeInput {
  name?: string;
  email?: string;
  role?: Role;
}

/** Slim record returned by create/update/status/branch-assignment mutations. */
export interface EmployeeMutationResult {
  id: string;
  name: string;
  email: string;
  role: Role;
  branches: string[];
  isActive: boolean;
}
