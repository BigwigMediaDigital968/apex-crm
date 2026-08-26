// src/features/dialer/hooks/useLeadCallHistory.ts
import { apiClient } from "@/services/apiClient";
import { useState, useEffect, useCallback } from "react";

export interface CallLogItem {
  _id: string;
  callId: string;
  fromNumber: string;
  toNumber: string;
  callStatus: "started" | "answered" | "ended" | "missed" | "rejected";
  duration: number;
  recordingUrl?: string;
  createdAt: string;
  caller?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const useLeadCallHistory = (leadId: string) => {
  const [calls, setCalls] = useState<CallLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCallHistory = useCallback(async () => {
    if (!leadId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/dialer/lead/${leadId}`);
      if (response.data.success) {
        setCalls(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch call history");
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchCallHistory();
  }, [fetchCallHistory]);

  return { calls, loading, error, refetch: fetchCallHistory };
};
