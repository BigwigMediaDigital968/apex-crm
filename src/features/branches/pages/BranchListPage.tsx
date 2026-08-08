import { useMemo, useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuthStore } from "@/store/auth.store";
import { ROLES } from "@/types/auth";
import BranchFormModal from "../components/BranchFormModal";
import { useBranchesQuery, useUpdateBranchStatus } from "../hooks/useBranches";
import type { Branch } from "@/types/branch";

const BranchListPage = () => {
  const user = useAuthStore((s) => s.user);
  const canManageBranches = user?.role === ROLES.HEAD || user?.role === ROLES.ADMIN;

  const { data: branches, isLoading, isError } = useBranchesQuery();
  const updateStatus = useUpdateBranchStatus();

  const [searchQuery, setSearchQuery] = useState("");
  const [formModal, setFormModal] = useState<{ open: boolean; branch: Branch | null }>(
    { open: false, branch: null }
  );
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

  const activeCount = branches?.filter((b) => b.isActive).length ?? 0;

  const handleConfirmStatusChange = async () => {
    if (!statusTarget) return;
    await updateStatus.mutateAsync({
      id: statusTarget._id,
      isActive: !statusTarget.isActive,
    });
    setStatusTarget(null);
  };

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-wider uppercase mb-1">
            <span className="h-0.5 w-4 bg-primary rounded-full" />
            <span>Operations</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Branch Network
          </h1>
          <p className="font-body-md text-on-surface-variant mt-1 max-w-2xl">
            View and manage every regional office your organization operates
            from.
          </p>
        </div>

        {canManageBranches && (
          <button
            onClick={() => setFormModal({ open: true, branch: null })}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-label-md text-on-primary shadow-md hover:bg-primary/90 transition-all self-start md:self-auto shrink-0"
          >
            <span className="material-symbols-outlined text-xl">add_business</span>
            <span>Create Branch</span>
          </button>
        )}
      </div>

      {/* Search + summary */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md items-center rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3.5 py-2.5 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, code, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-8 font-body-md text-on-surface outline-none placeholder:text-on-surface-variant/60"
          />
        </div>

        <p className="font-body-sm text-xs text-on-surface-variant">
          <span className="font-bold text-on-surface">{activeCount}</span>{" "}
          active of{" "}
          <span className="font-bold text-on-surface">
            {branches?.length ?? 0}
          </span>{" "}
          branches
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-error/30 bg-error-container/10 p-8 text-center">
          <span className="material-symbols-outlined text-3xl text-error">
            error
          </span>
          <p className="font-body-md text-sm text-error mt-2">
            Failed to load branches. Please try again.
          </p>
        </div>
      ) : filteredBranches.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-outline">
            domain
          </span>
          <p className="font-body-md text-on-surface-variant mt-2">
            No branches found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBranches.map((branch) => (
            <div
              key={branch._id}
              className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-label-md text-sm font-bold text-on-surface">
                    {branch.name}
                  </p>
                  <span className="font-label-sm text-[10px] font-bold tracking-wider text-primary uppercase">
                    {branch.code}
                  </span>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-label-sm text-[11px] font-semibold ${
                    branch.isActive
                      ? "bg-emerald-500/10 text-emerald-700"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      branch.isActive ? "bg-emerald-500" : "bg-outline"
                    }`}
                  />
                  {branch.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              <div className="space-y-1.5 font-body-sm text-xs text-on-surface-variant">
                {(branch.city || branch.state) && (
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      location_on
                    </span>
                    {[branch.city, branch.state, branch.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
                {branch.phone && (
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">call</span>
                    {branch.phone}
                  </p>
                )}
                {branch.email && (
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    {branch.email}
                  </p>
                )}
                {!branch.city && !branch.phone && !branch.email && (
                  <p className="text-on-surface-variant/50 italic">
                    No additional contact details on file.
                  </p>
                )}
              </div>

              {canManageBranches && (
                <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/20">
                  <button
                    onClick={() => setFormModal({ open: true, branch })}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 font-label-md text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => setStatusTarget(branch)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 font-label-md text-xs font-bold transition-colors ${
                      branch.isActive
                        ? "border-error/30 text-error hover:bg-error-container/10"
                        : "border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {branch.isActive ? "toggle_off" : "toggle_on"}
                    </span>
                    {branch.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <BranchFormModal
        key={formModal.open ? formModal.branch?._id ?? "create" : "closed"}
        open={formModal.open}
        branch={formModal.branch}
        onClose={() => setFormModal({ open: false, branch: null })}
      />

      <ConfirmDialog
        open={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleConfirmStatusChange}
        isLoading={updateStatus.isPending}
        tone={statusTarget?.isActive ? "danger" : "primary"}
        title={
          statusTarget?.isActive ? "Deactivate Branch?" : "Activate Branch?"
        }
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
