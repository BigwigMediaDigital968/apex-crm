// src/services/dialerApi.ts
import { apiClient } from "./apiClient";
import type { CallLogEntry } from "@/types/dialer";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const dialerApi = {
  /** GET /dialer/lead/:leadId — call history for a lead, branch-scoped server-side */
  getLeadCallHistory: async (leadId: string): Promise<CallLogEntry[]> => {
    const { data } = await apiClient.get<ApiEnvelope<CallLogEntry[]>>(
      `/dialer/lead/${leadId}`
    );
    return data.data;
  },
};