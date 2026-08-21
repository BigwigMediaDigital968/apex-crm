import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { Can } from "@/components/Auth/Can";
import { useAuthStore } from "@/store/auth.store";
import { useEmployeesQuery } from "@/features/employees";
import { ROLES } from "@/types/auth";
import type { LeadStatus } from "@/types/lead";
import {
    useLead,
    useLeadActivities,
    useLeadFollowUps,
    useUpdateLeadStatus,
    useAddLeadRemark,
    useAssignLead,
    useScheduleFollowUp,
    useCompleteFollowUp,
} from "../hooks/useLeads";

const STATUS_OPTIONS: { label: string; value: LeadStatus }[] = [
    { label: "New", value: "new" },
    { label: "Assigned", value: "assigned" },
    { label: "Contacted", value: "contacted" },
    { label: "Follow-up", value: "follow_up" },
    { label: "Interested", value: "interested" },
    { label: "Qualified", value: "qualified" },
    { label: "Converted", value: "converted" },
    { label: "Lost", value: "lost" },
    { label: "Closed", value: "closed" },
];

const STATUS_BADGE_CLASSES: Record<LeadStatus, string> = {
    new: "bg-indigo-500/10 text-indigo-700 border-indigo-200/40",
    assigned: "bg-sky-500/10 text-sky-700 border-sky-200/40",
    contacted: "bg-amber-500/10 text-amber-700 border-amber-200/40",
    follow_up: "bg-amber-500/10 text-amber-700 border-amber-200/40",
    interested: "bg-sky-500/10 text-sky-700 border-sky-200/40",
    qualified: "bg-emerald-500/10 text-emerald-700 border-emerald-200/40",
    converted: "bg-emerald-600 text-white border-transparent",
    lost: "bg-rose-500/10 text-rose-700 border-rose-200/40",
    closed: "bg-surface-container-high text-on-surface-variant border-outline-variant/30",
};

const LeadDetailPage = () => {
    const { leadId } = useParams<{ leadId: string }>();
    const navigate = useNavigate();
    const currentUser = useAuthStore((s) => s.user);

    const { data: lead, isLoading } = useLead(leadId);
    const { data: activities, isLoading: activitiesLoading } = useLeadActivities(leadId);
    const { data: followUps, isLoading: followUpsLoading } = useLeadFollowUps(leadId);

    const updateStatus = useUpdateLeadStatus();
    const addRemark = useAddLeadRemark();
    const assignLead = useAssignLead();
    const scheduleFollowUp = useScheduleFollowUp();
    const completeFollowUp = useCompleteFollowUp();

    const [statusForm, setStatusForm] = useState<{ status: LeadStatus | ""; remark: string }>({ status: "", remark: "" });
    const [remarkText, setRemarkText] = useState("");
    const [assigneeId, setAssigneeId] = useState("");
    const [followUpForm, setFollowUpForm] = useState({ scheduledAt: "", remark: "" });
    const [completingId, setCompletingId] = useState<string | null>(null);
    const [completeRemark, setCompleteRemark] = useState("");

    const branchId = useMemo(() => {
        if (!lead) return null;
        return typeof lead.branch === "object" ? lead.branch?._id : lead.branch;
    }, [lead]);

    const { data: branchEmployees } = useEmployeesQuery({
        role: ROLES.EMPLOYEE,
        branchId: String(branchId ?? ""),
        isActive: true,
        limit: 100,
    });

    if (isLoading || !lead) {
        return (
            <div className="flex h-96 items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="rounded-lg border border-outline-variant/30 p-2 hover:bg-surface-container-low transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-headline-sm text-2xl font-bold text-on-surface">{lead.name}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${STATUS_BADGE_CLASSES[lead.status]}`}>
                                {lead.status.replace("_", " ")}
                            </span>
                        </div>
                        <p className="font-body-sm text-xs text-on-surface-variant">
                            Created {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {lead.phone && (
                        <a
                            href={`tel:${lead.phoneCountryCode}${lead.phone}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-label-md text-xs font-bold text-on-primary"
                        >
                            <span className="material-symbols-outlined text-sm">call</span>
                            Call Lead
                        </a>
                    )}
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Operations */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Overview Card */}
                    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 space-y-4">
                        <h3 className="font-label-md text-xs font-bold uppercase text-primary">Lead Contact & Context</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                            <div>
                                <span className="text-on-surface-variant/70 font-semibold block">Phone</span>
                                <span className="font-bold text-on-surface">{lead.phoneCountryCode} {lead.phone}</span>
                            </div>
                            <div>
                                <span className="text-on-surface-variant/70 font-semibold block">Email</span>
                                <span className="font-bold text-on-surface">{lead.email || "—"}</span>
                            </div>
                            <div>
                                <span className="text-on-surface-variant/70 font-semibold block">City</span>
                                <span className="font-bold text-on-surface">{lead.city || "—"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status & Assignment Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 space-y-3">
                            <h4 className="font-label-md text-xs font-bold uppercase text-on-surface">Update Pipeline Stage</h4>
                            <select
                                value={statusForm.status}
                                onChange={(e) => setStatusForm((p) => ({ ...p, status: e.target.value as LeadStatus }))}
                                className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 text-xs text-on-surface"
                            >
                                <option value="">Select Status…</option>
                                {STATUS_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!leadId || !statusForm.status) return;
                                    await updateStatus.mutateAsync({ id: leadId, payload: { status: statusForm.status } });
                                    setStatusForm({ status: "", remark: "" });
                                }}
                                disabled={!statusForm.status}
                                className="w-full rounded-lg bg-primary py-2 text-xs font-bold text-on-primary disabled:opacity-50"
                            >
                                Update
                            </button>
                        </div>

                        <Can permission="lead:assign">
                            <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 space-y-3">
                                <h4 className="font-label-md text-xs font-bold uppercase text-on-surface">Reassign Lead</h4>
                                <select
                                    value={assigneeId}
                                    onChange={(e) => setAssigneeId(e.target.value)}
                                    className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 text-xs text-on-surface"
                                >
                                    <option value="">Select Employee…</option>
                                    {branchEmployees?.employees.map((emp) => (
                                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!leadId || !assigneeId) return;
                                        await assignLead.mutateAsync({ id: leadId, payload: { employeeId: assigneeId } });
                                        setAssigneeId("");
                                    }}
                                    disabled={!assigneeId}
                                    className="w-full rounded-lg bg-primary py-2 text-xs font-bold text-on-primary disabled:opacity-50"
                                >
                                    Assign
                                </button>
                            </div>
                        </Can>
                    </div>

                    {/* Follow-up Section */}
                    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 space-y-4">
                        <h3 className="font-label-md text-xs font-bold uppercase text-primary">Scheduled Follow-ups</h3>
                        <div className="flex gap-2">
                            <input
                                type="datetime-local"
                                value={followUpForm.scheduledAt}
                                onChange={(e) => setFollowUpForm((p) => ({ ...p, scheduledAt: e.target.value }))}
                                className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 text-xs text-on-surface"
                            />
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!leadId || !followUpForm.scheduledAt) return;
                                    await scheduleFollowUp.mutateAsync({
                                        id: leadId,
                                        payload: { scheduledAt: new Date(followUpForm.scheduledAt).toISOString() },
                                    });
                                    setFollowUpForm({ scheduledAt: "", remark: "" });
                                }}
                                disabled={!followUpForm.scheduledAt}
                                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary disabled:opacity-50"
                            >
                                Schedule
                            </button>
                        </div>

                        <div className="space-y-2">
                            {followUps?.map((fu) => (
                                <div key={fu._id} className="flex items-center justify-between rounded-lg border border-outline-variant/20 p-3 text-xs">
                                    <span>{new Date(fu.scheduledAt).toLocaleString()}</span>
                                    <span className="font-bold">{fu.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity Stream */}
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 space-y-4">
                    <h3 className="font-label-md text-xs font-bold uppercase text-primary">Activity Audit Log</h3>
                    <div className="space-y-4">
                        {activities?.map((act) => (
                            <div key={act._id} className="border-l-2 border-primary/40 pl-3 space-y-0.5 text-xs">
                                <p className="font-bold text-on-surface">{act.activityType}</p>
                                <p className="text-on-surface-variant">{act.performedBy?.name || "System"}</p>
                                <p className="text-[10px] text-on-surface-variant/60">{new Date(act.createdAt).toLocaleTimeString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetailPage;