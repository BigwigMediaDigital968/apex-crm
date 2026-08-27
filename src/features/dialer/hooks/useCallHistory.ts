// src/features/dialer/hooks/useCallLogs.ts
import { useQuery } from "@tanstack/react-query";
import {
  dialerApi,
  type CallLogEntry,
  type CallLogsPagination,
  type GetCallLogsQueryParams,
} from "@/services/dialerApi";

// Query keys factory for clean cache invalidation
export const dialerKeys = {
  all: ["dialer"] as const,
  logs: () => [...dialerKeys.all, "logs"] as const,
  logList: (params: GetCallLogsQueryParams) => [...dialerKeys.logs(), params] as const,
  leadHistory: (leadId: string) => [...dialerKeys.all, "lead-history", leadId] as const,
};

export interface UseCallLogsReturn {
  logs: CallLogEntry[];
  pagination: CallLogsPagination;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCallLogs = (
  initialParams: GetCallLogsQueryParams = { limit: 10, page: 1 }
): UseCallLogsReturn => {
  const query = useQuery({
    queryKey: dialerKeys.logList(initialParams),
    queryFn: async () => {
      const response = await dialerApi.getCallLogs(initialParams);
      if (!response.success) {
        throw new Error("Failed to fetch call logs");
      }
      return response;
    },
  });

  const defaultPagination: CallLogsPagination = {
    total: 0,
    page: initialParams.page || 1,
    limit: initialParams.limit || 10,
    totalPages: 1,
  };

  return {
    logs: query.data?.data ?? [],
    pagination: query.data?.pagination ?? defaultPagination,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch,
  };
};

export interface UseLeadCallHistoryReturn {
  calls: CallLogEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useLeadCallHistory = (leadId: string): UseLeadCallHistoryReturn => {
  const query = useQuery({
    queryKey: dialerKeys.leadHistory(leadId),
    queryFn: () => dialerApi.getLeadCallHistory(leadId),
    enabled: Boolean(leadId),
  });

  return {
    calls: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch,
  };
};