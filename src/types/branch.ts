export interface Branch {
  _id: string;
  name: string;
  code: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  teamSize?: string;
}

export interface BranchFormInput {
  name: string;
  code: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
}

/** Minimal shape returned when a branch is populated onto another document (e.g. an employee). */
export interface BranchRef {
  _id: string;
  name: string;
  code: string;
}
