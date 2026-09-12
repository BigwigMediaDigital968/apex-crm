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

export const REPORT_MODULES = {
  ALL: "ALL",
  LEAD: "LEAD",
  ATTENDANCE: "ATTENDANCE",
  CALL_LOG: "CALL_LOG",
  REVENUE: "REVENUE",
  LEAVE: "LEAVE",
} as const;

export type ReportModule = (typeof REPORT_MODULES)[keyof typeof REPORT_MODULES];

export const REPORT_MODULE_LABELS: Record<ReportModule, string> = {
  ALL: "Dashboard Summary",
  LEAD: "Leads",
  ATTENDANCE: "Attendance",
  CALL_LOG: "Call Logs",
  REVENUE: "Revenue",
  LEAVE: "Leave",
};

export type ReportFormat = "csv" | "excel";

export interface ExportReportFilters extends DashboardReportFilters {
  module?: ReportModule;
  format?: ReportFormat;
}

export interface ExportedReport {
  blob: Blob;
  filename: string;
}

const FORMAT_EXTENSIONS: Record<ReportFormat, string> = {
  csv: "csv",
  excel: "xlsx",
};

/** Pulls the server's filename out of Content-Disposition when it survives CORS. */
const filenameFromDisposition = (disposition?: string) =>
  disposition?.match(/filename=([^;]+)/i)?.[1]?.trim().replace(/"/g, "");

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

  /** GET /reports/export — returns a CSV/XLSX attachment, not JSON. */
  exportReport: async (
    filters: ExportReportFilters = {}
  ): Promise<ExportedReport> => {
    const module = filters.module ?? "ALL";
    const format = filters.format ?? "csv";

    const response = await apiClient.get<Blob>("/reports/export", {
      params: { ...filters, module, format },
      responseType: "blob",
    });

    return {
      blob: response.data,
      filename:
        filenameFromDisposition(response.headers["content-disposition"]) ??
        `report-${module}-${Date.now()}.${FORMAT_EXTENSIONS[format]}`,
    };
  },
};
