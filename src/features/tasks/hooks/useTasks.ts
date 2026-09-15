import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import { tasksApi } from "@/services/tasksApi";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { CreateTaskPayload, Task, TaskListQuery, UpdateTaskPayload } from "@/types/task";

/* =========================================================
   Query Keys
========================================================= */

export const taskQueryKeys = {
  all: ["tasks"] as const,

  lists: () => [...taskQueryKeys.all, "list"] as const,

  list: (query: TaskListQuery) => [...taskQueryKeys.lists(), query] as const,

  details: () => [...taskQueryKeys.all, "detail"] as const,

  detail: (id: string) => [...taskQueryKeys.details(), id] as const,

  activities: (id: string) => [...taskQueryKeys.detail(id), "activities"] as const,
};

/* =========================================================
   TASKS LIST
   GET /tasks
========================================================= */

export const useTasks = (query: TaskListQuery = {}) => {
  return useQuery({
    queryKey: taskQueryKeys.list(query),
    queryFn: () => tasksApi.list(query),
  });
};

/* =========================================================
   SINGLE TASK
   GET /tasks/:id
========================================================= */

export const useTask = (id?: string) => {
  return useQuery({
    queryKey: taskQueryKeys.detail(id ?? ""),

    queryFn: () => tasksApi.getById(id!),

    enabled: Boolean(id),
  });
};

/* =========================================================
   CREATE TASK
   POST /tasks
========================================================= */

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => tasksApi.create(payload),

    onSuccess: () => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create task"));
    },
  });
};

/* =========================================================
   UPDATE TASK
   PATCH /tasks/:id
========================================================= */

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTaskPayload;
      /** Skip the success toast — for high-frequency actions like a board drag. */
      silent?: boolean;
    }) => tasksApi.update(id, payload),

    // Patch every cached task list immediately so a board drag (or the
    // inline status select) reflects instantly instead of waiting on the
    // round-trip — rolled back in onError if the request fails.
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.lists() });

      const previousLists = queryClient.getQueriesData<Task[]>({
        queryKey: taskQueryKeys.lists(),
      });

      queryClient.setQueriesData<Task[]>(
        { queryKey: taskQueryKeys.lists() },
        (old) =>
          old?.map((task) =>
            task._id === id ? { ...task, ...payload } as Task : task
          )
      );

      return { previousLists };
    },

    onSuccess: (task, variables) => {
      if (!variables.silent) toast.success("Task updated successfully");

      // PATCH /tasks/:id returns the raw (unpopulated) document, unlike
      // GET /tasks/:id — invalidate rather than cache it directly so the
      // detail view refetches the fully populated task instead of losing
      // assignedTo/branch/assignedBy back to raw ObjectId strings.
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.detail(task._id) });

      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });

      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.activities(task._id),
      });
    },

    onError: (error, _variables, context) => {
      context?.previousLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(getErrorMessage(error, "Failed to update task"));
    },
  });
};

/* =========================================================
   TASK ACTIVITIES
   GET /tasks/:id/activities
========================================================= */

export const useTaskActivities = (id?: string) => {
  return useQuery({
    queryKey: taskQueryKeys.activities(id ?? ""),

    queryFn: () => tasksApi.getActivities(id!),

    enabled: Boolean(id),
  });
};
