import { apiClient } from "./apiClient";
import type { ApiEnvelope } from "./apiEnvelope";

export interface DashboardReportFilters {
  startDate?: string;
  endDate?: string;
  branchId?: string;
  employeeId?: string;
}

export interface LeadStatusBreakdown {
  status: string;
  count: number;
}

export interface DashboardLeadsSummary {
  totalLeads: number;
  statusBreakdown: LeadStatusBreakdown[];
}

/** The other DashboardSummary sections (attendance/calls/revenue/leaves) are
 * raw Mongo aggregation output — shape kept loose since no widget consumes
 * them yet. */
export interface DashboardSummary {
  leads: DashboardLeadsSummary;
  attendance: unknown[];
  calls: unknown[];
  revenue: unknown[];
  leaves: unknown[];
}

export const reportApi = {
  /** GET /reports/dashboard — role/branch-scoped server-side. */
  getDashboard: async (
    filters: DashboardReportFilters = {}
  ): Promise<DashboardSummary> => {
    const { data } = await apiClient.get<ApiEnvelope<DashboardSummary>>(
      "/reports/dashboard",
      { params: filters }
    );
    return data.data;
  },
};
