// src/features/dialer/hooks/useLeadCallHistory.ts
import { useQuery } from "@tanstack/react-query";
import { dialerApi } from "@/services/dialerApi";

export const useLeadCallHistory = (leadId?: string) =>
  useQuery({
    queryKey: ["dialer", "lead-history", leadId],
    queryFn: () => dialerApi.getLeadCallHistory(leadId as string),
    enabled: Boolean(leadId),
  });