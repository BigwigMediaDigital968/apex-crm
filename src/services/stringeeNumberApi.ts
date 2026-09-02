import { apiClient } from "./apiClient";
import type { ApiEnvelope } from "./apiEnvelope";
import type {
  CreateStringeeNumberInput,
  StringeeNumber,
  UpdateStringeeNumberInput,
} from "@/types/stringeeNumber";

export const stringeeNumberApi = {
  list: async () => {
    const { data } = await apiClient.get<ApiEnvelope<StringeeNumber[]>>(
      "/stringee-numbers/list"
    );
    return data.data;
  },

  create: async (payload: CreateStringeeNumberInput) => {
    const { data } = await apiClient.post<ApiEnvelope<StringeeNumber>>(
      "/stringee-numbers/add",
      payload
    );
    return data.data;
  },

  update: async (numberId: string, payload: UpdateStringeeNumberInput) => {
    const { data } = await apiClient.put<ApiEnvelope<StringeeNumber>>(
      `/stringee-numbers/${numberId}`,
      payload
    );
    return data;
  },

  assign: async (numberId: string, targetUserId: string | null) => {
    const { data } = await apiClient.patch<ApiEnvelope<StringeeNumber>>(
      `/stringee-numbers/${numberId}/assign`,
      { targetUserId }
    );
    return data;
  },
};