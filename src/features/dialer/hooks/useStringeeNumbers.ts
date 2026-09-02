import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { stringeeNumberApi } from "@/services/stringeeNumberApi";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { CreateStringeeNumberInput, UpdateStringeeNumberInput } from "@/types/stringeeNumber";

export const stringeeNumberKeys = {
  all: ["stringee-numbers"] as const,
};

export const useStringeeNumbersQuery = () =>
  useQuery({
    queryKey: stringeeNumberKeys.all,
    queryFn: stringeeNumberApi.list,
  });

export const useCreateStringeeNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStringeeNumberInput) =>
      stringeeNumberApi.create(payload),
    onSuccess: () => {
      toast.success("Phone number added successfully");
      queryClient.invalidateQueries({ queryKey: stringeeNumberKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to add phone number"));
    },
  });
};

export const useUpdateStringeeNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ numberId, payload }: { numberId: string; payload: UpdateStringeeNumberInput }) =>
      stringeeNumberApi.update(numberId, payload),
    onSuccess: (_) => {
      // Invalidate the query so the table re-fetches updated data automatically
      queryClient.invalidateQueries({ queryKey: ["stringee-numbers"] });

      toast.success("Virtual number details updated successfully.");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update virtual number details.";
      toast.error(errorMessage);
    },
  });
};

export const useAssignStringeeNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      numberId,
      targetUserId,
    }: {
      numberId: string;
      targetUserId: string | null;
    }) => stringeeNumberApi.assign(numberId, targetUserId),
    onSuccess: (_, variables) => {
      toast.success(
        variables.targetUserId
          ? "Number assigned successfully"
          : "Number unassigned successfully"
      );
      queryClient.invalidateQueries({ queryKey: stringeeNumberKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update assignment"));
    },
  });
};