import type { Pagination } from "./global";

export const LEAD_STATUS = {
  NEW: "new",
  ASSIGNED: "assigned",
  CONTACTED: "contacted",
  FOLLOW_UP: "follow_up",
  INTERESTED: "interested",
  QUALIFIED: "qualified",
  CONVERTED: "converted",
  LOST: "lost",
  CLOSED: "closed",
} as const;

export const LEAD_SOURCE_TYPE = {
  MANUAL: "MANUAL",
  EXCEL: "EXCEL",
  API: "API",
  IMPORT: "IMPORT",
} as const;

export interface Lead {
  _id: string;
  name: string;

  phoneCountryCode: string;

  phone: string;

  email?: string;

  city?: string;

  industry?: string;

  message?: string;

  status: LeadStatus;

  remarks?: string;

  source: string;

  sourceType: LeadSourceType;

  externalId?: string;

  branch: string;

  assignedTo?: string;

  assignedBy?: string;

  assignedAt?: Date;

  createdBy: string;

  isDeleted: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface LeadListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  branchId?: string;
  assignedTo?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: "createdAt" | "updatedAt" | "name" | "status";
  sortOrder?: "asc" | "desc";
}

export interface LeadListResponse {
  leads: Lead[];
  pagination: Pagination;
}


export interface CreateLeadPayload {
  name: string;
  phoneCountryCode: string;
  phone: string;
  email?: string;
  city?: string;
  industry?: string;
  message?: string;
  remarks?: string;
  source: string;
  sourceType: "MANUAL" | "EXCEL" | "API" | "IMPORT";
  branchId?: string;
}

export interface AssignLeadPayload {
  employeeId: string;
}

export interface UpdateLeadStatusPayload {
  status:
  | "new"
  | "assigned"
  | "contacted"
  | "follow_up"
  | "interested"
  | "qualified"
  | "converted"
  | "lost"
  | "closed";
  remark?: string;
}

export interface AddLeadRemarkPayload {
  remark: string;
}

export interface CreateLeadFollowUpPayload {
  scheduledAt: string;
  remark?: string;
}

export interface CompleteLeadFollowUpPayload {
  remark: string;
}

export interface LeadFollowUp {
  _id: string;
  lead: string;
  assignedTo: string | {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdBy: string;
  branch: string;
  scheduledAt: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "MISSED";
  remark?: string;
  completedAt?: string | null;
  completedBy?: string | {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivity {
  _id: string;
  lead: string;
  activityType:
  | "created"
  | "assigned"
  | "status_changed"
  | "remark_added"
  | "follow_up";
  performedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  previousStatus?: string;
  newStatus?: string;
  remark?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];
export type LeadSourceType = (typeof LEAD_SOURCE_TYPE)[keyof typeof LEAD_SOURCE_TYPE];
