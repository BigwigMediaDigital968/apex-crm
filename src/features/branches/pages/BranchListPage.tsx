import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Can } from "@/components/Auth/Can";
import BranchFormModal from "../components/BranchFormModal";
import { useBranchAttendanceConfig, useBranchesQuery, useUpdateBranchStatus } from "../hooks/useBranches";
import type { Branch } from "@/types/branch";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface BranchViewModalProps {
  branch: Branch | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onConfigureAttendance: () => void;
  onToggleStatus: () => void;
  onAssignAdmin: () => void;
}

const BranchViewModal = ({
  branch,
  open,
  onClose,
  onEdit,
  onConfigureAttendance,
  onToggleStatus,
  onAssignAdmin,
}: BranchViewModalProps) => {
  const { data: attendanceData, isLoading: attendanceLoading } =
    useBranchAttendanceConfig(open ? branch?._id : undefined);

  if (!open || !branch) return null;

  const config = attendanceData?.attendanceConfig;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-outline-variant/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">domain</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-on-surface">{branch.name}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                    branch.isActive
                      ? "bg-emerald-500/10 text-emerald-700"
                      : "bg-blue-500/10 text-blue-700"
                  }`}
                >
                  {branch.isActive ? "Active" : "Setup Phase"}
                </span>
              </div>
              <p className="font-mono text-xs font-bold text-on-surface-variant/70 mt-0.5">
                CODE: {branch.code}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2 rounded-xl bg-surface-container-low p-3.5 space-y-1">
            <p className="font-bold uppercase tracking-wider text-[10px] text-on-surface-variant">
              Full Address
            </p>
            <p className="font-semibold text-on-surface">
              {[branch.address, branch.city, branch.state, branch.country]
                .filter(Boolean)
                .join(", ") || "Address not provided"}
            </p>
          </div>
          <div className="rounded-xl bg-surface-container-low p-3.5 space-y-1">
            <p className="font-bold uppercase tracking-wider text-[10px] text-on-surface-variant">
              City / Region
            </p>
            <p className="font-bold text-on-surface">{branch.city || "N/A"}</p>
          </div>
          <div className="rounded-xl bg-surface-container-low p-3.5 space-y-1">
            <p className="font-bold uppercase tracking-wider text-[10px] text-on-surface-variant">
              Team Size
            </p>
            <p className="font-bold text-on-surface">
              {branch.teamSize ? `${branch.teamSize} Members` : "No staff recorded"}
            </p>
          </div>
        </div>

        {/* Attendance summary */}
        <Can permission="branch-attendance:view">
          <div className="rounded-xl border border-outline-variant/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-label-md text-xs font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-primary">
                  fingerprint
                </span>
                Attendance Rules
              </p>
              <button
                type="button"
                onClick={onConfigureAttendance}
                className="font-label-sm text-[11px] font-bold text-primary hover:underline"
              >
                Configure
              </button>
            </div>

            {attendanceLoading ? (
              <div className="h-10 rounded-lg bg-surface-container-high animate-pulse" />
            ) : config ? (
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span
                  className={`rounded-full px-2.5 py-1 font-bold ${
                    config.enabled
                      ? "bg-emerald-500/10 text-emerald-700"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {config.enabled ? "Enabled" : "Disabled"}
                </span>
                <span className="rounded-full bg-surface-container-low px-2.5 py-1 font-semibold text-on-surface-variant">
                  {config.workingDays
                    .slice()
                    .sort((a:any, b:any) => a - b)
                    .map((d:any) => DAY_LABELS[d])
                    .join(", ") || "No working days set"}
                </span>
                <span className="rounded-full bg-surface-container-low px-2.5 py-1 font-semibold text-on-surface-variant">
                  {config.workingHours.startTime}–{config.workingHours.endTime}
                </span>
                <span className="rounded-full bg-surface-container-low px-2.5 py-1 font-semibold text-on-surface-variant">
                  {config.gracePeriodMinutes}m grace
                </span>
              </div>
            ) : (
              <p className="font-body-sm text-xs text-on-surface-variant/70 italic">
                Attendance settings haven't been configured yet.
              </p>
            )}
          </div>
        </Can>

        {/* Admin assignment note — not a branch-level action, so link out */}
        <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3">
          <span className="material-symbols-outlined text-on-surface-variant">
            admin_panel_settings
          </span>
          <p className="font-body-sm text-xs text-on-surface-variant flex-1">
            Branch admins are assigned from the Employees directory, not here.
          </p>
          <button
            type="button"
            onClick={onAssignAdmin}
            className="font-label-sm text-[11px] font-bold text-primary hover:underline shrink-0"
          >
            Go to Employees
          </button>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-outline-variant/40 px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Close
          </button>
          <Can permission="branch:update">
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleStatus}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                  branch.isActive
                    ? "bg-rose-500/10 text-rose-700 hover:bg-rose-500/20"
                    : "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {branch.isActive ? "toggle_off" : "toggle_on"}
                </span>
                <span>{branch.isActive ? "Deactivate" : "Activate"}</span>
              </button>
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-on-primary shadow-sm hover:bg-primary/90 transition-all"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                <span>Edit Branch</span>
              </button>
            </div>
          </Can>
        </div>
      </div>
    </div>
  );
};

const BranchListPage = () => {
  const navigate = useNavigate();
  const { data: branches, isLoading, isError } = useBranchesQuery();
  const updateStatus = useUpdateBranchStatus();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewBranch, setViewBranch] = useState<Branch | null>(null);
  const [formModal, setFormModal] = useState<{
    open: boolean;
    branch: Branch | null;
    initialTab: "details" | "attendance";
  }>(() => {
    const params = new URLSearchParams(window.location.search);
    return { open: params.has("new"), branch: null, initialTab: "details" };
  });
  const [statusTarget, setStatusTarget] = useState<Branch | null>(null);

  const filteredBranches = useMemo(() => {
    if (!branches) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return branches;
    return branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(query) ||
        branch.code.toLowerCase().includes(query) ||
        branch.city?.toLowerCase().includes(query)
    );
  }, [branches, searchQuery]);

  const handleConfirmStatusChange = async () => {
    if (!statusTarget) return;
    await updateStatus.mutateAsync({
      id: statusTarget._id,
      isActive: !statusTarget.isActive,
    });
    setStatusTarget(null);
  };

  const openEdit = (branch: Branch, initialTab: "details" | "attendance" = "details") =>
    setFormModal({ open: true, branch, initialTab });

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-wider uppercase mb-1">
            <span className="h-0.5 w-4 bg-primary rounded-full" />
            <span>Operations</span>
          </div>
          <h1 className="font-headline-md text-2xl sm:text-3xl font-extrabold text-on-surface">
            Branch Network
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl">
            View and manage every regional office your organization operates from.
          </p>
        </div>

        <Can permission="branch:create">
          <button
            onClick={() => setFormModal({ open: true, branch: null, initialTab: "details" })}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-label-md text-xs font-bold text-on-primary shadow-sm hover:bg-primary/90 transition-all self-start md:self-auto shrink-0"
          >
            <span className="material-symbols-outlined text-lg">add_business</span>
            <span>Create Branch</span>
          </button>
        </Can>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md items-center rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3.5 py-2.5 shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, code, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-8 font-body-sm text-xs sm:text-sm text-on-surface outline-none placeholder:text-on-surface-variant/60"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-error/30 bg-error/10 p-8 text-center">
          <span className="material-symbols-outlined text-3xl text-error">error</span>
          <p className="font-body-md text-sm text-error mt-2">Failed to load branches. Please try again.</p>
        </div>
      ) : filteredBranches.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-outline-variant">domain</span>
          <p className="font-body-md text-on-surface-variant mt-2">No branches found matching your search.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-xs">
          <table className="w-full text-left border-collapse font-body-sm text-xs">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/50 font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-4 px-6">Branch Code</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6 text-center">Team Size</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredBranches.map((branch) => (
                <tr key={branch._id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-extrabold text-xs text-on-surface">
                    {branch.code}
                  </td>
                  <td className="py-4 px-6">
                    <button onClick={() => setViewBranch(branch)} className="text-left group">
                      <p className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                        {branch.name}
                      </p>
                      <p className="text-on-surface-variant text-xs mt-0.5">
                        {[branch.address, branch.city, branch.state, branch.country]
                          .filter(Boolean)
                          .join(", ") || "Address not provided"}
                      </p>
                    </button>
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-on-surface">
                    {branch?.teamSize ?? "—"}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-3 py-1 font-label-sm text-[10px] font-extrabold uppercase tracking-wider ${
                        branch.isActive
                          ? "bg-emerald-500/10 text-emerald-700"
                          : "bg-blue-500/10 text-blue-700"
                      }`}
                    >
                      {branch.isActive ? "Active" : "Setup Phase"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Can permission="branch:view">
                        <button
                          onClick={() => setViewBranch(branch)}
                          className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                      </Can>
                      <Can permission="branch:update">
                        <button
                          onClick={() => openEdit(branch)}
                          className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                          title="Edit Branch"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        {/* Fixed: status toggle is a `branch:update` action on the
                            backend, not `branch:delete` — the old gate hid this
                            from Admin, who has update but not delete. */}
                        <button
                          onClick={() => setStatusTarget(branch)}
                          className={`rounded-lg p-1.5 transition-colors ${
                            branch.isActive
                              ? "text-error hover:bg-error/10"
                              : "text-emerald-700 hover:bg-emerald-500/10"
                          }`}
                          title={branch.isActive ? "Deactivate" : "Activate"}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {branch.isActive ? "toggle_off" : "toggle_on"}
                          </span>
                        </button>
                      </Can>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <BranchViewModal
        open={Boolean(viewBranch)}
        branch={viewBranch}
        onClose={() => setViewBranch(null)}
        onEdit={() => {
          if (viewBranch) openEdit(viewBranch);
          setViewBranch(null);
        }}
        onConfigureAttendance={() => {
          if (viewBranch) openEdit(viewBranch, "attendance");
          setViewBranch(null);
        }}
        onToggleStatus={() => {
          setStatusTarget(viewBranch);
          setViewBranch(null);
        }}
        onAssignAdmin={() => {
          if (viewBranch) navigate(`/employees?branchId=${viewBranch._id}`);
        }}
      />

      <BranchFormModal
        key={formModal.open ? formModal.branch?._id ?? "create" : "closed"}
        open={formModal.open}
        branch={formModal.branch}
        initialTab={formModal.initialTab}
        onClose={() => setFormModal({ open: false, branch: null, initialTab: "details" })}
      />

      <ConfirmDialog
        open={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleConfirmStatusChange}
        isLoading={updateStatus.isPending}
        tone={statusTarget?.isActive ? "danger" : "primary"}
        title={statusTarget?.isActive ? "Deactivate Branch?" : "Activate Branch?"}
        description={
          statusTarget?.isActive
            ? `${statusTarget?.name} will stop appearing in active branch lists and new employees can no longer be assigned to it.`
            : `${statusTarget?.name} will become available again for assignments.`
        }
        confirmLabel={statusTarget?.isActive ? "Deactivate" : "Activate"}
      />
    </div>
  );
};

export default BranchListPage;