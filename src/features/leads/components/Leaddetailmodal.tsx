import { useState } from "react";
import Modal from "@/components/ui/Modal";
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

interface LeadDetailModalProps {
  leadId: string | null;
  onClose: () => void;
}

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
  new: "bg-indigo-500/10 text-indigo-700",
  assigned: "bg-sky-500/10 text-sky-700",
  contacted: "bg-amber-500/10 text-amber-700",
  follow_up: "bg-amber-500/10 text-amber-700",
  interested: "bg-sky-500/10 text-sky-700",
  qualified: "bg-emerald-500/10 text-emerald-700",
  converted: "bg-green-500/10 text-green-700",
  lost: "bg-rose-500/10 text-rose-700",
  closed: "bg-surface-container-high text-on-surface-variant",
};

const ACTIVITY_LABELS: Record<string, string> = {
  created: "Lead created",
  assigned: "Lead assigned",
  status_changed: "Status changed",
  remark_added: "Remark added",
  follow_up: "Follow-up activity",
};

const FOLLOW_UP_BADGE_CLASSES: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-700",
  COMPLETED: "bg-emerald-500/10 text-emerald-700",
  CANCELLED: "bg-surface-container-high text-on-surface-variant",
  MISSED: "bg-rose-500/10 text-rose-700",
};

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SectionCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/40 p-4 space-y-3">
    <h4 className="flex items-center gap-2 font-label-md text-xs font-bold text-on-surface">
      <span className="material-symbols-outlined text-base text-primary">
        {icon}
      </span>
      {title}
    </h4>
    {children}
  </div>
);

const LeadDetailModal = ({ leadId, onClose }: LeadDetailModalProps) => {
  const open = Boolean(leadId);
  const currentUser = useAuthStore((s) => s.user);

  const { data: lead, isLoading } = useLead(leadId ?? undefined);
  const { data: activities, isLoading: activitiesLoading } =
    useLeadActivities(leadId ?? undefined);
  const { data: followUps, isLoading: followUpsLoading } = useLeadFollowUps(
    leadId ?? undefined
  );

  const updateStatus = useUpdateLeadStatus();
  const addRemark = useAddLeadRemark();
  const assignLead = useAssignLead();
  const scheduleFollowUp = useScheduleFollowUp();
  const completeFollowUp = useCompleteFollowUp();

  const [statusForm, setStatusForm] = useState<{
    status: LeadStatus | "";
    remark: string;
  }>({ status: "", remark: "" });
  const [remarkText, setRemarkText] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [followUpForm, setFollowUpForm] = useState({
    scheduledAt: "",
    remark: "",
  });
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completeRemark, setCompleteRemark] = useState("");

  const branchId =
    lead && typeof lead.branch === "object" ? lead.branch._id : lead?.branch;

  const { data: branchEmployees, isLoading: employeesLoading } =
    useEmployeesQuery({
      role: ROLES.EMPLOYEE,
      branchId: String(branchId),
      isActive: true,
      limit: 100,
    });

  const assignedToId =
    lead?.assignedTo && typeof lead.assignedTo === "object"
      ? lead.assignedTo._id
      : lead?.assignedTo;

  const resetLocalState = () => {
    setStatusForm({ status: "", remark: "" });
    setRemarkText("");
    setAssigneeId("");
    setFollowUpForm({ scheduledAt: "", remark: "" });
    setCompletingId(null);
    setCompleteRemark("");
  };

  const handleClose = () => {
    resetLocalState();
    onClose();
  };

  const handleUpdateStatus = async () => {
    if (!leadId || !statusForm.status) return;
    await updateStatus.mutateAsync({
      id: leadId,
      payload: {
        status: statusForm.status,
        remark: statusForm.remark.trim() || undefined,
      },
    });
    setStatusForm({ status: "", remark: "" });
  };

  const handleAddRemark = async () => {
    if (!leadId || !remarkText.trim()) return;
    await addRemark.mutateAsync({
      id: leadId,
      payload: { remark: remarkText.trim() },
    });
    setRemarkText("");
  };

  const handleAssign = async () => {
    if (!leadId || !assigneeId) return;
    await assignLead.mutateAsync({
      id: leadId,
      payload: { employeeId: assigneeId },
    });
    setAssigneeId("");
  };

  const handleScheduleFollowUp = async () => {
    if (!leadId || !followUpForm.scheduledAt) return;
    await scheduleFollowUp.mutateAsync({
      id: leadId,
      payload: {
        scheduledAt: new Date(followUpForm.scheduledAt).toISOString(),
        remark: followUpForm.remark.trim() || undefined,
      },
    });
    setFollowUpForm({ scheduledAt: "", remark: "" });
  };

  const handleCompleteFollowUp = async (followUpId: string) => {
    if (!completeRemark.trim()) return;
    await completeFollowUp.mutateAsync({
      followUpId,
      payload: { remark: completeRemark.trim() },
    });
    setCompletingId(null);
    setCompleteRemark("");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={lead ? lead.name : "Lead Details"}
      description={
        lead ? `${lead.phoneCountryCode} ${lead.phone}` : undefined
      }
      size="lg"
    >
      {isLoading || !lead ? (
        <div className="flex items-center justify-center py-16">
          <span className="material-symbols-outlined animate-spin text-2xl text-primary">
            progress_activity
          </span>
        </div>
      ) : (
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          {/* Overview */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-label-sm text-[11px] font-bold ${STATUS_BADGE_CLASSES[lead.status]}`}
            >
              {lead.status.replace("_", " ").toUpperCase()}
            </span>
            {lead.email && (
              <span className="font-body-sm text-xs text-on-surface-variant">
                {lead.email}
              </span>
            )}
            {lead.city && (
              <span className="font-body-sm text-xs text-on-surface-variant">
                • {lead.city}
              </span>
            )}
            {lead.industry && (
              <span className="font-body-sm text-xs text-on-surface-variant">
                • {lead.industry}
              </span>
            )}
          </div>
          {lead.remarks && (
            <p className="rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-xs text-on-surface-variant italic">
              "{lead.remarks}"
            </p>
          )}

          {/* Update Status */}
          <SectionCard title="Update Status" icon="sync_alt">
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={statusForm.status}
                onChange={(e) =>
                  setStatusForm((prev) => ({
                    ...prev,
                    status: e.target.value as LeadStatus,
                  }))
                }
                className="flex-1 rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 font-body-sm text-xs text-on-surface outline-none focus:border-primary"
              >
                <option value="">Select new status…</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={!statusForm.status || updateStatus.isPending}
                className="rounded-lg bg-primary px-4 py-2 font-label-md text-xs font-bold text-on-primary disabled:opacity-50"
              >
                {updateStatus.isPending ? "Updating…" : "Update"}
              </button>
            </div>
            <input
              type="text"
              placeholder="Optional remark about this change"
              value={statusForm.remark}
              onChange={(e) =>
                setStatusForm((prev) => ({ ...prev, remark: e.target.value }))
              }
              className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 font-body-sm text-xs text-on-surface outline-none focus:border-primary"
            />
          </SectionCard>

          {/* Add Remark */}
          <SectionCard title="Add Remark" icon="edit_note">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                placeholder="Write a remark…"
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                className="flex-1 rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 font-body-sm text-xs text-on-surface outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddRemark}
                disabled={!remarkText.trim() || addRemark.isPending}
                className="rounded-lg bg-primary px-4 py-2 font-label-md text-xs font-bold text-on-primary disabled:opacity-50"
              >
                {addRemark.isPending ? "Saving…" : "Save"}
              </button>
            </div>
          </SectionCard>

          {/* Assign */}
          <Can permission="lead:assign">
            <SectionCard title="Assign Lead" icon="assignment_ind">
              {assignedToId && typeof lead.assignedTo === "object" && (
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Currently assigned to{" "}
                  <span className="font-bold text-on-surface">
                    {lead.assignedTo.name}
                  </span>
                </p>
              )}
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  disabled={employeesLoading}
                  className="flex-1 rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 font-body-sm text-xs text-on-surface outline-none focus:border-primary disabled:opacity-60"
                >
                  <option value="">
                    {employeesLoading
                      ? "Loading employees…"
                      : "Select an employee…"}
                  </option>
                  {branchEmployees?.employees
                    .filter((emp) => emp._id !== assignedToId)
                    .map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.email})
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={handleAssign}
                  disabled={!assigneeId || assignLead.isPending}
                  className="rounded-lg bg-primary px-4 py-2 font-label-md text-xs font-bold text-on-primary disabled:opacity-50"
                >
                  {assignLead.isPending ? "Assigning…" : "Assign"}
                </button>
              </div>
              {branchEmployees && branchEmployees.employees.length === 0 && (
                <p className="font-body-sm text-[11px] text-on-surface-variant/70 italic">
                  No active employees in this lead's branch yet.
                </p>
              )}
            </SectionCard>
          </Can>

          {/* Follow-ups */}
          <SectionCard title="Follow-ups" icon="event_upcoming">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="datetime-local"
                value={followUpForm.scheduledAt}
                onChange={(e) =>
                  setFollowUpForm((prev) => ({
                    ...prev,
                    scheduledAt: e.target.value,
                  }))
                }
                className="flex-1 rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 font-body-sm text-xs text-on-surface outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleScheduleFollowUp}
                disabled={
                  !followUpForm.scheduledAt || scheduleFollowUp.isPending
                }
                className="rounded-lg bg-primary px-4 py-2 font-label-md text-xs font-bold text-on-primary disabled:opacity-50 whitespace-nowrap"
              >
                {scheduleFollowUp.isPending ? "Scheduling…" : "Schedule"}
              </button>
            </div>
            <input
              type="text"
              placeholder="Optional note for this follow-up"
              value={followUpForm.remark}
              onChange={(e) =>
                setFollowUpForm((prev) => ({
                  ...prev,
                  remark: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 font-body-sm text-xs text-on-surface outline-none focus:border-primary"
            />

            <div className="space-y-2 pt-1">
              {followUpsLoading ? (
                <div className="h-10 animate-pulse rounded-lg bg-surface-container-high" />
              ) : !followUps || followUps.length === 0 ? (
                <p className="font-body-sm text-[11px] text-on-surface-variant/70 italic">
                  No follow-ups scheduled yet.
                </p>
              ) : (
                followUps.map((fu) => {
                  const fuAssigneeId =
                    typeof fu.assignedTo === "object"
                      ? fu.assignedTo._id
                      : fu.assignedTo;
                  const canComplete =
                    fu.status === "PENDING" &&
                    currentUser?._id === fuAssigneeId;

                  return (
                    <div
                      key={fu._id}
                      className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-body-sm text-xs font-bold text-on-surface">
                          {formatDateTime(fu.scheduledAt)}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 font-label-sm text-[10px] font-bold ${FOLLOW_UP_BADGE_CLASSES[fu.status]}`}
                        >
                          {fu.status}
                        </span>
                      </div>
                      {fu.remark && (
                        <p className="font-body-sm text-[11px] text-on-surface-variant">
                          {fu.remark}
                        </p>
                      )}
                      {canComplete && (
                        completingId === fu._id ? (
                          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                            <input
                              type="text"
                              autoFocus
                              placeholder="Completion remark…"
                              value={completeRemark}
                              onChange={(e) =>
                                setCompleteRemark(e.target.value)
                              }
                              className="flex-1 rounded-lg border border-outline-variant/40 bg-surface-container-low px-2.5 py-1.5 font-body-sm text-[11px] text-on-surface outline-none focus:border-primary"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleCompleteFollowUp(fu._id)}
                                disabled={
                                  !completeRemark.trim() ||
                                  completeFollowUp.isPending
                                }
                                className="rounded-lg bg-emerald-600 px-3 py-1.5 font-label-sm text-[11px] font-bold text-white disabled:opacity-50"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCompletingId(null);
                                  setCompleteRemark("");
                                }}
                                className="rounded-lg border border-outline-variant/40 px-3 py-1.5 font-label-sm text-[11px] font-bold text-on-surface-variant"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setCompletingId(fu._id)}
                            className="font-label-sm text-[11px] font-bold text-primary hover:underline"
                          >
                            Mark complete
                          </button>
                        )
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </SectionCard>

          {/* Activity Timeline */}
          <SectionCard title="Activity Timeline" icon="history">
            {activitiesLoading ? (
              <div className="h-16 animate-pulse rounded-lg bg-surface-container-high" />
            ) : !activities || activities.length === 0 ? (
              <p className="font-body-sm text-[11px] text-on-surface-variant/70 italic">
                No activity recorded yet.
              </p>
            ) : (
              <div className="space-y-3 relative before:absolute before:left-[7px] before:top-1 before:bottom-1 before:w-px before:bg-outline-variant/30">
                {activities.map((activity) => (
                  <div key={activity._id} className="relative pl-5">
                    <span className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-primary bg-surface-container-lowest" />
                    <p className="font-label-sm text-[11px] font-bold text-on-surface">
                      {ACTIVITY_LABELS[activity.activityType] ??
                        activity.activityType}
                    </p>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">
                      {activity.performedBy?.name ?? "Unknown"}
                      {activity.previousStatus && activity.newStatus && (
                        <>
                          {" "}
                          — {activity.previousStatus} → {activity.newStatus}
                        </>
                      )}
                      {activity.remark && <> · "{activity.remark}"</>}
                    </p>
                    <p className="font-body-sm text-[10px] text-on-surface-variant/60">
                      {formatDateTime(activity.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}
    </Modal>
  );
};

export default LeadDetailModal;