import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useBranchesQuery } from "@/features/branches";
import {
  useEmployeeCountsByBranch,
  useEmployeesQuery,
} from "@/features/employees";
import { TaskOverviewWidget } from "@/features/tasks";
import { useLeads } from "@/features/leads";
import { useDashboardReport } from "../hooks/useDashboardReport";
import ExportReportButton from "../components/ExportReportButton";

const TIMEFRAMES = ["This Week", "This Month", "This Quarter"] as const;
type Timeframe = (typeof TIMEFRAMES)[number];

const timeframeRange = (timeframe: Timeframe) => {
  const endDate = new Date();
  const startDate = new Date();
  if (timeframe === "This Week") startDate.setDate(endDate.getDate() - 7);
  else if (timeframe === "This Quarter")
    startDate.setMonth(endDate.getMonth() - 3);
  else startDate.setMonth(endDate.getMonth() - 1);
  return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
};

const formatStatus = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const HeadDashboardPage = () => {
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<Timeframe>("This Month");

  const { data: branches, isLoading: branchesLoading } = useBranchesQuery();
  const { data: employeesData, isLoading: employeesLoading } =
    useEmployeesQuery({
      limit: 1,
    });

  const branchIds = useMemo(
    () => branches?.map((b) => b._id) ?? [],
    [branches],
  );
  const { counts: employeeCountsByBranch } =
    useEmployeeCountsByBranch(branchIds);

  const totalEmployees = employeesData?.pagination.total;
  const totalBranches = branches?.length;

  const { data: leadData, isLoading: leadLoading } = useLeads({
    limit: 1,
  });

  const totalLeads = leadData?.pagination?.total;

  const { data: recentLeadsData, isLoading: recentLeadsLoading } = useLeads({
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // const { data: dashboardReport, isLoading: reportLoading } = useDashboardReport(
  //   timeframeRange(selectedTimeframe)
  // );

  // ✅ AFTER (Stable reference with memoization):
  const timeframeFilters = useMemo(
    () => timeframeRange(selectedTimeframe),
    [selectedTimeframe],
  );

  const { data: dashboardReport, isLoading: reportLoading } =
    useDashboardReport(timeframeFilters);

  const statusBreakdown = dashboardReport?.leads.statusBreakdown ?? [];
  const maxStatusCount = Math.max(1, ...statusBreakdown.map((s) => s.count));

  const topBranches = useMemo(() => (branches ?? []).slice(0, 5), [branches]);

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-wider uppercase mb-1">
            <span className="h-0.5 w-4 bg-primary rounded-full" />
            <span>Executive Overview</span>
          </div>
          <h1 className="font-headline-md text-3xl font-bold text-on-surface">
            Head Dashboard
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
            Real-time insights across all regional operations and workforce
            metrics.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-1 shadow-sm">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg font-label-md text-xs transition-all ${
                selectedTimeframe === tf
                  ? "bg-primary font-bold text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm">
        <p className="font-label-sm text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 mb-3">
          Quick Management Actions
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {/* Exports the same timeframe the dashboard is showing. */}
          <ExportReportButton filters={timeframeFilters} />

          {/* Primary Action Button */}
          <Link
            to={"/employees/onboard"}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-label-md text-xs font-bold text-on-primary shadow-sm hover:bg-primary/90 transition-all"
          >
            <span className="material-symbols-outlined text-lg">
              person_add
            </span>
            <span>Create Employee</span>
          </Link>

          <Link
            to={"/branches/new"}
            className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 font-label-md text-xs font-bold text-on-surface hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-lg text-primary">
              add_business
            </span>
            <span>Create Branch</span>
          </Link>

          <Link
            to={"/leads"}
            className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 font-label-md text-xs font-bold text-on-surface hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-lg">
              person_search
            </span>
            <span>Add New Lead</span>
          </Link>

          {/* Icon-Only Action with UI/UX Tooltip */}
          <div className="relative group ml-auto">
            <button
              aria-label="Export Global Business Report"
              disabled
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface-variant/50 cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-xl">
                download
              </span>
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-20">
              <div className="bg-on-surface text-surface-container-lowest font-label-sm text-[11px] py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap">
                Reporting coming soon
              </div>
              <div className="w-2 h-2 bg-on-surface rotate-45 absolute right-4 -bottom-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Leads */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Total Leads
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700">
              <span className="material-symbols-outlined text-lg">
                leaderboard
              </span>
            </span>
          </div>
          {leadLoading ? (
            <div className="h-9 w-16 rounded-lg bg-surface-container-high animate-pulse" />
          ) : (
            <p className="font-headline-md text-3xl font-extrabold text-on-surface">
              {totalLeads ?? 0}
            </p>
          )}
          <Link
            to="/leads"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
          >
            <span className="material-symbols-outlined text-sm">group</span>
            <span>View All Leads</span>
            <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-0.5">
              chevron_right
            </span>
          </Link>
        </div>

        {/* Total Employees */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Total Workforce
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-700">
              <span className="material-symbols-outlined text-lg">badge</span>
            </span>
          </div>
          {employeesLoading ? (
            <div className="h-9 w-16 rounded-lg bg-surface-container-high animate-pulse" />
          ) : (
            <p className="font-headline-md text-3xl font-extrabold text-on-surface">
              {totalEmployees ?? 0}
            </p>
          )}
          <Link
            to="/workforce"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
          >
            <span className="material-symbols-outlined text-sm">badge</span>
            <span>View All Workforce</span>
            <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-0.5">
              chevron_right
            </span>
          </Link>
        </div>

        {/* Total Branches */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Active Branches
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700">
              <span className="material-symbols-outlined text-lg">domain</span>
            </span>
          </div>
          {branchesLoading ? (
            <div className="h-9 w-16 rounded-lg bg-surface-container-high animate-pulse" />
          ) : (
            <p className="font-headline-md text-3xl font-extrabold text-on-surface">
              {String(totalBranches ?? 0).padStart(2, "0")}
            </p>
          )}
          <Link
            to="/branches"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
          >
            <span className="material-symbols-outlined text-sm">domain</span>
            <span>View All Branches</span>
            <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-0.5">
              chevron_right
            </span>
          </Link>
        </div>
      </div>

      {/* Task Overview — scoped by the backend to every branch for Head */}
      <TaskOverviewWidget
        title="Task Overview"
        description="Live task load across every branch in the organization."
      />

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Real Performance Visualizer) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Leads by Status
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  {selectedTimeframe} · {dashboardReport?.leads.totalLeads ?? 0}{" "}
                  leads created in range
                </p>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              {reportLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 rounded-lg bg-surface-container-high animate-pulse"
                  />
                ))
              ) : statusBreakdown.length === 0 ? (
                <p className="py-6 text-center font-body-sm text-xs text-on-surface-variant/70">
                  No leads created in this timeframe.
                </p>
              ) : (
                statusBreakdown
                  .slice()
                  .sort((a, b) => b.count - a.count)
                  .map((entry) => (
                    <div key={entry.status} className="space-y-1">
                      <div className="flex items-center justify-between font-label-sm text-xs">
                        <span className="font-bold text-on-surface">
                          {formatStatus(entry.status)}
                        </span>
                        <span className="font-mono text-on-surface-variant">
                          {entry.count}
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{
                            width: `${(entry.count / maxStatusCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Recent Leads */}
          <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
            <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                Recent Leads
              </h3>
              <Link
                to="/leads"
                className="font-label-sm text-[11px] font-bold text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="divide-y divide-outline-variant/20">
              {recentLeadsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4">
                    <div className="h-10 rounded-lg bg-surface-container-high animate-pulse" />
                  </div>
                ))
              ) : (recentLeadsData?.leads ?? []).length === 0 ? (
                <p className="p-6 text-center font-body-sm text-xs text-on-surface-variant/70">
                  No leads yet.
                </p>
              ) : (
                recentLeadsData!.leads.map((lead) => {
                  const branchName =
                    lead.branch && typeof lead.branch === "object"
                      ? lead.branch.name
                      : "—";
                  return (
                    <Link
                      to={`/leads/${lead._id}`}
                      key={lead._id}
                      className="flex items-center justify-between p-4 hover:bg-surface-container-low/40 transition-colors"
                    >
                      <div>
                        <p className="font-label-md text-sm font-bold text-on-surface">
                          {lead.name}
                        </p>
                        <p className="font-body-sm text-xs text-on-surface-variant">
                          {branchName} · {lead.phone}
                        </p>
                      </div>

                      <span className="inline-block rounded-full bg-sky-500/10 px-2 py-0.5 font-label-sm text-[10px] font-semibold text-sky-700 shrink-0">
                        {formatStatus(lead.status)}
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Branch Breakdown) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 space-y-4 shadow-sm">
            <h3 className="font-headline-sm text-base font-bold text-on-surface">
              Branch Breakdown
            </h3>

            {branchesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl bg-surface-container-high animate-pulse"
                  />
                ))}
              </div>
            ) : !branches || branches.length === 0 ? (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-3xl text-outline">
                  domain
                </span>
                <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                  No branches yet. Create your first one to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {topBranches.map((branch) => (
                  <div
                    key={branch._id}
                    className="rounded-xl border border-outline-variant/30 bg-surface-container-low/40 p-3.5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-label-md text-sm font-bold text-on-surface">
                        {branch.name}
                      </p>
                      <span className="font-label-sm text-[10px] font-bold text-primary uppercase">
                        {branch.code}
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-body-sm text-xs text-on-surface-variant/80">
                      <span>
                        {employeeCountsByBranch[branch._id] ?? "…"} Employees
                      </span>
                      {branch.city && <span>{branch.city}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              to="/branches"
              className="block w-full py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low font-label-md text-xs font-bold text-on-surface text-center hover:bg-surface-container transition-colors"
            >
              Manage All Branches
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadDashboardPage;
