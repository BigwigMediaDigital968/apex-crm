import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { AuditLogQueryParams } from "@/types/audit";
import { fetchAuditLogs } from "@/services/auditApi";

export const auditLogsQueryKey = (params: AuditLogQueryParams) =>
  ["audit-logs", params] as const;

export const useAuditLogs = (params: AuditLogQueryParams) => {
  return useQuery({
    queryKey: auditLogsQueryKey(params),
    queryFn: () => fetchAuditLogs(params),
    placeholderData: keepPreviousData,
  });
};