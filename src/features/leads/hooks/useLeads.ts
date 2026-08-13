import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    leadsApi,
} from "@/services/leadsApi";
import type { 
    AddLeadRemarkPayload, 
    AssignLeadPayload, 
    CompleteLeadFollowUpPayload, 
    CreateLeadFollowUpPayload, 
    CreateLeadPayload, 
    LeadListQuery, 
    UpdateLeadStatusPayload 
} from "@/types/lead";

/* =========================================================
   Query Keys
========================================================= */

export const leadQueryKeys = {
    all: ["leads"] as const,

    lists: () => [...leadQueryKeys.all, "list"] as const,

    list: (query: LeadListQuery) =>
        [...leadQueryKeys.lists(), query] as const,

    details: () => [...leadQueryKeys.all, "detail"] as const,

    detail: (id: string) =>
        [...leadQueryKeys.details(), id] as const,

    activities: (id: string) =>
        [...leadQueryKeys.detail(id), "activities"] as const,

    followUps: (id: string) =>
        [...leadQueryKeys.detail(id), "follow-ups"] as const,

    myFollowUps: () =>
        [...leadQueryKeys.all, "my-follow-ups"] as const,
};


/* =========================================================
   LEADS LIST
   GET /leads
========================================================= */

export const useLeads = (query: LeadListQuery = {}) => {
    return useQuery({
        queryKey: leadQueryKeys.list(query),
        queryFn: () => leadsApi.list(query),
    });
};


/* =========================================================
   SINGLE LEAD
   GET /leads/:id
========================================================= */

export const useLead = (id?: string) => {
    return useQuery({
        queryKey: leadQueryKeys.detail(id ?? ""),

        queryFn: () => leadsApi.getById(id!),

        enabled: Boolean(id),
    });
};


/* =========================================================
   CREATE LEAD
   POST /leads
========================================================= */

export const useCreateLead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateLeadPayload) =>
            leadsApi.create(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: leadQueryKeys.lists(),
            });
        },
    });
};


/* =========================================================
   ASSIGN LEAD
   PATCH /leads/:id/assign
========================================================= */

export const useAssignLead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: AssignLeadPayload;
        }) => leadsApi.assign(id, payload),

        onSuccess: (lead) => {
            // Update current lead cache immediately
            queryClient.setQueryData(
                leadQueryKeys.detail(lead._id),
                lead
            );

            // Refresh lists because assignedTo changed
            queryClient.invalidateQueries({
                queryKey: leadQueryKeys.lists(),
            });

            // Activities may also have changed
            queryClient.invalidateQueries({
                queryKey: leadQueryKeys.activities(lead._id),
            });
        },
    });
};


/* =========================================================
   UPDATE STATUS
   PATCH /leads/:id/status
========================================================= */

export const useUpdateLeadStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateLeadStatusPayload;
        }) => leadsApi.updateStatus(id, payload),

        onSuccess: (lead) => {
            queryClient.setQueryData(
                leadQueryKeys.detail(lead._id),
                lead
            );

            queryClient.invalidateQueries({
                queryKey: leadQueryKeys.lists(),
            });

            queryClient.invalidateQueries({
                queryKey: leadQueryKeys.activities(lead._id),
            });
        },
    });
};


/* =========================================================
   ADD REMARK
   POST /leads/:id/remarks
========================================================= */

export const useAddLeadRemark = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: AddLeadRemarkPayload;
        }) => leadsApi.addRemark(id, payload),

        onSuccess: (lead) => {
            queryClient.setQueryData(
                leadQueryKeys.detail(lead._id),
                lead
            );

            queryClient.invalidateQueries({
                queryKey: leadQueryKeys.activities(lead._id),
            });
        },
    });
};


/* =========================================================
   LEAD ACTIVITIES
   GET /leads/:id/activities
========================================================= */

export const useLeadActivities = (id?: string) => {
    return useQuery({
        queryKey: leadQueryKeys.activities(id ?? ""),

        queryFn: () => leadsApi.getActivities(id!),

        enabled: Boolean(id),
    });
};


/* =========================================================
   IMPORT LEADS
   POST /leads/import
========================================================= */

export const useImportLeads = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            file,
            branchId,
        }: {
            file: File;
            branchId: string;
        }) => leadsApi.import(file, branchId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: leadQueryKeys.lists(),
            });
        },
    });
};


/* =========================================================
   SCHEDULE FOLLOW-UP
   POST /leads/:id/follow-ups
========================================================= */

export const useScheduleFollowUp = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: CreateLeadFollowUpPayload;
        }) => leadsApi.scheduleFollowUp(id, payload),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: leadQueryKeys.followUps(variables.id),
            });

            queryClient.invalidateQueries({
                queryKey: leadQueryKeys.myFollowUps(),
            });

            queryClient.invalidateQueries({
                queryKey: leadQueryKeys.activities(variables.id),
            });
        },
    });
};


/* =========================================================
   COMPLETE FOLLOW-UP
   PATCH /leads/follow-ups/:followUpId/complete
========================================================= */

export const useCompleteFollowUp = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            followUpId,
            payload,
        }: {
            followUpId: string;
            payload: CompleteLeadFollowUpPayload;
        }) => leadsApi.completeFollowUp(followUpId, payload),

        onSuccess: (followUp) => {
            queryClient.invalidateQueries({
                queryKey: leadQueryKeys.followUps(
                    typeof followUp.lead === "string"
                        ? followUp.lead
                        : followUp.lead
                ),
            });

            queryClient.invalidateQueries({
                queryKey: leadQueryKeys.myFollowUps(),
            });

            // Activity is created when follow-up is completed.
            const leadId =
                typeof followUp.lead === "string"
                    ? followUp.lead
                    : followUp.lead;

            queryClient.invalidateQueries({
                queryKey: leadQueryKeys.activities(leadId),
            });
        },
    });
};


/* =========================================================
   FOLLOW-UPS FOR LEAD
   GET /leads/:id/follow-ups
========================================================= */

export const useLeadFollowUps = (id?: string) => {
    return useQuery({
        queryKey: leadQueryKeys.followUps(id ?? ""),

        queryFn: () => leadsApi.getFollowUps(id!),

        enabled: Boolean(id),
    });
};


/* =========================================================
   MY FOLLOW-UPS
   GET /leads/my/follow-ups
========================================================= */

export const useMyFollowUps = () => {
    return useQuery({
        queryKey: leadQueryKeys.myFollowUps(),

        queryFn: () => leadsApi.getMyFollowUps(),
    });
};