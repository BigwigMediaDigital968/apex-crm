import type {
  CallLogEntry,
  GetCallLogsQueryParams,
} from "@/services/dialerApi";
import React, { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCallLogs } from "../hooks/useCallHistory";

const formatDuration = (seconds: number) => {
  if (!seconds) return "--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

const getStatusBadge = (status: CallLogEntry["callStatus"]) => {
  switch (status) {
    case "answered":
    case "ended":
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    case "missed":
    case "rejected":
      return "bg-rose-500/10 text-rose-700 border-rose-500/20";
    case "started":
      return "bg-amber-500/10 text-amber-700 border-amber-500/20";
    default:
      return "bg-surface-container-high text-on-surface-variant border-outline-variant/30";
  }
};

const CallHistoryPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  // Helper to establish scoped initial filters per role
  const getDefaultRoleParams = (): Partial<GetCallLogsQueryParams> => {
    if (!user) return {};

    switch (user.role) {
      case "employee":
        return { userId: user._id };
      case "manager":
      case "admin":
        // Managers & Admins view logs for their assigned primary branch
        return { branchId: user.branches?.[0] };
      case "head":
      default:
        return {}; // Head has global scope
    }
  };

  const [queryParams, setQueryParams] = useState<GetCallLogsQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    leadId: "",
    ...getDefaultRoleParams(),
  });

  const { logs, pagination, loading, error, refetch } =
    useCallLogs(queryParams);

  const handleFilterChange = (
    key: keyof GetCallLogsQueryParams,
    value: string,
  ) => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1, // Reset pagination when modifying filters
      [key]: value || undefined,
    }));
  };

  const handleResetFilters = () => {
    setQueryParams({
      page: 1,
      limit: 10,
      search: undefined,
      status: undefined,
      leadId: undefined,
      ...getDefaultRoleParams(),
    });
  };

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
        <div>
          <h1 className="font-headline-md text-2xl font-black text-on-surface tracking-tight">
            Call Logs & Communications Audit
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            Centralized voice history, audio recordings, and telemetry across
            your CRM
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 text-xs font-bold text-on-surface transition-all"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Refresh Logs
        </button>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Search phone number..."
              value={queryParams.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-low pl-9 pr-4 py-2 text-xs text-on-surface outline-none focus:border-primary transition-all"
            />
          </div>

          {/* Call Status Filter */}
          <div>
            <select
              value={queryParams.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-xs text-on-surface outline-none focus:border-primary transition-all capitalize"
            >
              <option value="">All Call Statuses</option>
              <option value="answered">Answered</option>
              <option value="ended">Ended</option>
              <option value="missed">Missed</option>
              <option value="rejected">Rejected</option>
              <option value="started">Started</option>
            </select>
          </div>

          {/* Lead ID Filter */}
          <div>
            <input
              type="text"
              placeholder="Filter by Lead ID..."
              value={queryParams.leadId || ""}
              onChange={(e) => handleFilterChange("leadId", e.target.value)}
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-xs text-on-surface outline-none focus:border-primary transition-all"
            />
          </div>

          {/* Branch Filter (Only visible to Head roles) */}
          {user?.role === "head" && (
            <div>
              <input
                type="text"
                placeholder="Filter by Branch ID..."
                value={queryParams.branchId || ""}
                onChange={(e) => handleFilterChange("branchId", e.target.value)}
                className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-xs text-on-surface outline-none focus:border-primary transition-all"
              />
            </div>
          )}
        </div>

        {/* Toolbar Footer & Clear Action */}
        <div className="flex items-center justify-between border-t border-outline-variant/10 pt-3">
          <span className="text-[11px] font-semibold text-on-surface-variant">
            Viewing records as:{" "}
            <strong className="uppercase text-primary">{user?.role}</strong>
          </span>
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">
              restart_alt
            </span>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Error View */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Data Table */}
      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-2">
            <span className="material-symbols-outlined text-3xl text-primary animate-spin">
              progress_activity
            </span>
            <p className="text-xs font-semibold text-on-surface-variant">
              Fetching call logs...
            </p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
              phone_disabled
            </span>
            <p className="font-label-md text-xs font-semibold text-on-surface-variant">
              No call logs found for this filter scope
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="py-3 px-4">Lead / Contact</th>
                  <th className="py-3 px-4">Agent / Caller</th>
                  <th className="py-3 px-4">Routing Numbers</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Recording</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-xs text-on-surface">
                {logs.map((log: CallLogEntry) => (
                  <tr
                    key={log._id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold">
                      {log.lead?.name || "Unlinked Lead"}
                      {log.lead?.email && (
                        <span className="block text-[10px] font-normal text-on-surface-variant">
                          {log.lead.email}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-semibold">
                      {log.caller?.name || "System Agent"}
                      {log.branch?.name && (
                        <span className="block text-[10px] font-normal text-primary">
                          {log.branch.name}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-sans font-extrabold uppercase bg-surface-container-high text-on-surface-variant">
                            From
                          </span>
                          <span className="font-semibold text-on-surface">
                            {log.fromNumber || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-sans font-extrabold uppercase bg-primary/10 text-primary">
                            To
                          </span>
                          <span className="font-semibold text-on-surface">
                            {log.toNumber || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                          log.callStatus,
                        )}`}
                      >
                        {log.callStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      {formatDuration(log.duration)}
                    </td>

                    <td className="py-3.5 px-4">
                      {log.recordingUrl ? (
                        <audio
                          controls
                          src={log.recordingUrl}
                          className="h-7 w-48 rounded-md"
                        />
                      ) : (
                        <span className="text-[10px] text-on-surface-variant/60 italic">
                          No Recording
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-on-surface-variant">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant/20 bg-surface-container-low">
            <p className="text-xs text-on-surface-variant">
              Page <span className="font-bold">{pagination.page}</span> of{" "}
              <span className="font-bold">{pagination.totalPages}</span> (
              {pagination.total} entries)
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() =>
                  setQueryParams((prev) => ({
                    ...prev,
                    page: (prev.page || 1) - 1,
                  }))
                }
                className="px-3 py-1 text-xs font-bold rounded-lg border border-outline-variant/30 hover:bg-surface-container-high disabled:opacity-40 transition-all"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  setQueryParams((prev) => ({
                    ...prev,
                    page: (prev.page || 1) + 1,
                  }))
                }
                className="px-3 py-1 text-xs font-bold rounded-lg border border-outline-variant/30 hover:bg-surface-container-high disabled:opacity-40 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallHistoryPage;
