import { Link, useNavigate } from "react-router";
import { TaskOverviewWidget } from "@/features/tasks";
import { useEmployeesQuery } from "@/features/employees";
import { useBranchesQuery } from "@/features/branches/hooks/useBranches";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { useAuditLogs } from "@/features/logs/hooks/useAuditLogs";
import ExportReportButton from "../components/ExportReportButton";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const { data: usersData, isLoading: usersLoading } = useEmployeesQuery({ limit: 5 });
  const { data: activeUsersData } = useEmployeesQuery({ isActive: true, limit: 1 });
  const { data: branches, isLoading: branchesLoading } = useBranchesQuery();
  const { data: leadsData, isLoading: leadsLoading } = useLeads({ limit: 1 });
  const { data: auditData, isLoading: auditLoading } = useAuditLogs({
    limit: 4,
    sortOrder: "desc",
  });

  const activeBranches = (branches ?? []).filter((b) => b.isActive);
  const totalUsers = usersData?.pagination.total ?? 0;
  const activeUsers = activeUsersData?.pagination.total ?? 0;

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-8">

      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/30 pb-5">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-wider uppercase mb-1">
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            <span>System Administration</span>
          </div>
          <h1 className="font-headline-md text-2xl sm:text-3xl font-extrabold text-on-surface">
            Admin Management Console
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
            Full system control across users, branch assignments, and audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportReportButton />
          <button
            onClick={() => navigate("/employees/onboard")}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-label-md text-xs font-bold text-on-primary hover:bg-primary/90 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* 2. System KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* User Management Stat */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              System Users
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-lg">manage_accounts</span>
            </span>
          </div>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface">
            {usersLoading ? "…" : totalUsers}
          </p>
          <p className="font-label-sm text-xs font-medium text-emerald-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {usersLoading ? "Loading…" : `${activeUsers} Active • ${totalUsers - activeUsers} Inactive`}
          </p>
        </div>

        {/* Branch Control Stat */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Active Branches
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700">
              <span className="material-symbols-outlined text-lg">storefront</span>
            </span>
          </div>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface">
            {branchesLoading ? "…" : String(activeBranches.length).padStart(2, "0")}
          </p>
          <p className="font-label-sm text-xs font-medium text-on-surface-variant truncate">
            {branchesLoading
              ? "Loading…"
              : activeBranches.map((b) => b.name).join(", ") || "No active branches"}
          </p>
        </div>

        {/* Leads Stat */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Total Leads
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700">
              <span className="material-symbols-outlined text-lg">hub</span>
            </span>
          </div>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface">
            {leadsLoading ? "…" : leadsData?.pagination.total ?? 0}
          </p>
          <p className="font-label-sm text-xs font-medium text-on-surface-variant">
            Across all managed branches
          </p>
        </div>

        {/* Security Audit Log Count */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Audit Log Entries
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-700">
              <span className="material-symbols-outlined text-lg">shield</span>
            </span>
          </div>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface">
            {auditLoading ? "…" : auditData?.pagination.total ?? 0}
          </p>
          <p className="font-label-sm text-xs font-bold text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">verified</span>
            Recorded system-wide
          </p>
        </div>

      </div>

      {/* 3. Action Hub Mapped to Admin Permissions */}
      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-4">
        <h2 className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
          Admin Quick Operations
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

          <button
            onClick={() => navigate("/employees")}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
          >
            <span className="material-symbols-outlined text-2xl text-primary group-hover:scale-110 transition-transform">
              group
            </span>
            <span className="font-label-md text-xs font-bold text-on-surface">
              Employee Management
            </span>
          </button>

          <button
            onClick={() => navigate("/branches")}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
          >
            <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:scale-110 transition-transform">
              domain
            </span>
            <span className="font-label-md text-xs font-bold text-on-surface">
              Branch Management
            </span>
          </button>

          <button
            onClick={() => navigate("/leads")}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
          >
            <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:scale-110 transition-transform">
              hub
            </span>
            <span className="font-label-md text-xs font-bold text-on-surface">
              Lead Management
            </span>
          </button>

          <button
            onClick={() => navigate("/logs")}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
          >
            <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:scale-110 transition-transform">
              history
            </span>
            <span className="font-label-md text-xs font-bold text-on-surface">
              Activity Logs
            </span>
          </button>

          <button
            onClick={() => navigate("/tasks")}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
          >
            <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:scale-110 transition-transform">
              task_alt
            </span>
            <span className="font-label-md text-xs font-bold text-on-surface">
              Task Management
            </span>
          </button>

        </div>
      </div>

      {/* Task Overview — scoped by the backend to this admin's assigned branches */}
      <TaskOverviewWidget
        title="Task Overview"
        description="Task load across the branches you manage."
      />

      {/* 4. Core Management Section (User Management & Audit Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (User Directory Table) */}
        <div className="lg:col-span-2 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-5 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                User Directory & Access Control
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Manage roles, statuses, and branch assignments.
              </p>
            </div>

            <Link
              to="/employees"
              className="font-label-md text-xs font-bold text-primary hover:underline self-start sm:self-auto"
            >
              View All Users
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low/50 font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant/70">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">System Role</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-sm text-xs text-on-surface">
                {usersLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="py-3.5 px-4">
                        <div className="h-6 rounded-lg bg-surface-container-high animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : (usersData?.employees ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 px-4 text-center text-on-surface-variant">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  usersData!.employees.map((user) => (
                    <tr key={user._id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-label-md font-bold">{user.name}</p>
                          <p className="font-body-sm text-[11px] text-on-surface-variant/70">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-label-sm text-xs font-semibold capitalize">
                        {user.role}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant">
                        {user.branches[0]?.name ?? "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${user.isActive
                            ? "bg-emerald-500/10 text-emerald-700"
                            : "bg-error/10 text-error"
                            }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-error"}`} />
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/employees/${user._id}/edit`}
                          aria-label="Edit User"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Security Audit Trail */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-700 text-xl">security</span>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                Audit Trail Log
              </h3>
            </div>
          </div>

          <div className="space-y-3.5 divide-y divide-outline-variant/10">
            {auditLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="pt-3 first:pt-0">
                  <div className="h-10 rounded-lg bg-surface-container-high animate-pulse" />
                </div>
              ))
            ) : (auditData?.logs ?? []).length === 0 ? (
              <p className="py-4 text-center font-body-sm text-xs text-on-surface-variant/70">
                No audit activity recorded yet.
              </p>
            ) : (
              auditData!.logs.map((log) => (
                <div key={log._id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[10px] font-bold font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="font-body-sm text-[10px] text-on-surface-variant/60">
                      {new Date(log.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface">
                    {log.actor?.name ?? "System"} — {log.entity}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 text-center border-t border-outline-variant/20">
            <Link to="/logs" className="font-label-md text-xs font-bold text-primary hover:underline">
              View All Audit Logs
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardPage;
