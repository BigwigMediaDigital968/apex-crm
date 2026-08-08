import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { branchApi } from "@/services/branchApi";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { BranchFormInput } from "@/types/branch";

export const branchKeys = {
  all: ["branches"] as const,
};

export const useBranchesQuery = () =>
  useQuery({
    queryKey: branchKeys.all,
    queryFn: branchApi.list,
  });

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BranchFormInput) => branchApi.create(payload),
    onSuccess: () => {
      toast.success("Branch created successfully");
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create branch"));
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<BranchFormInput>;
    }) => branchApi.update(id, payload),
    onSuccess: () => {
      toast.success("Branch updated successfully");
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update branch"));
    },
  });
};

export const useUpdateBranchStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      branchApi.updateStatus(id, isActive),
    onSuccess: (branch) => {
      toast.success(
        branch.isActive
          ? "Branch activated successfully"
          : "Branch deactivated successfully"
      );
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update branch status"));
    },
  });
};
