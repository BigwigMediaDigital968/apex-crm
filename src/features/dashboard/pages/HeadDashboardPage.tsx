import { useMemo, useState } from "react";
import { Link } from "react-router";
import { BranchFormModal, useBranchesQuery } from "@/features/branches";
import { useEmployeeCountsByBranch, useEmployeesQuery } from "@/features/employees";

interface RecentLead {
  id: string;
  name: string;
  company: string;
  value: string;
  branch: string;
  status: string;
}

const MOCK_RECENT_LEADS: RecentLead[] = [
  {
    id: "1",
    name: "Vikram Tech Corp",
    company: "Enterprise",
    value: "₹12.5L",
    branch: "Delhi (HQ)",
    status: "Negotiation",
  },
  {
    id: "2",
    name: "Apex Logistics",
    company: "Mid-Market",
    value: "₹6.2L",
    branch: "Mumbai",
    status: "Contacted",
  },
  {
    id: "3",
    name: "Zenith Software",
    company: "SMB",
    value: "₹3.8L",
    branch: "Bengaluru",
    status: "New Lead",
  },
];

const HeadDashboardPage = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("This Month");
  const [isCreateBranchOpen, setIsCreateBranchOpen] = useState(false);

  const { data: branches, isLoading: branchesLoading } = useBranchesQuery();
  const { data: employeesData, isLoading: employeesLoading } = useEmployeesQuery({
    limit: 1,
  });

  const branchIds = useMemo(() => branches?.map((b) => b._id) ?? [], [branches]);
  const { counts: employeeCountsByBranch } = useEmployeeCountsByBranch(branchIds);

  const totalEmployees = employeesData?.pagination.total;
  const totalBranches = branches?.length;

  const topBranches = useMemo(
    () => (branches ?? []).slice(0, 5),
    [branches]
  );

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
            Real-time insights across all regional operations and workforce metrics.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-1 shadow-sm">
          {["This Week", "This Month", "This Quarter"].map((tf) => (
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
            to={'/branches?new'}
            className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 font-label-md text-xs font-bold text-on-surface hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-lg text-primary">
              add_business
            </span>
            <span>Create Branch</span>
          </Link>

          {/* Leads module isn't wired to a backend yet — surfaced but disabled so the UI stays honest */}
          <div className="relative group">
            <Link
              to={'/leads?new'}
            className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 font-label-md text-xs font-bold text-on-surface hover:bg-surface-container-high transition-all"
            >
              <span className="material-symbols-outlined text-lg">
                person_search
              </span>
              <span>Add New Lead</span>
            </Link>
            {/* <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-20">
              <div className="bg-on-surface text-surface-container-lowest font-label-sm text-[11px] py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap">
                Leads module coming soon
              </div>
              <div className="w-2 h-2 bg-on-surface rotate-45 absolute left-4 -bottom-1" />
            </div> */}
          </div>

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
        {/* Total Leads (sample data — no leads backend yet) */}
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
          <p className="font-headline-md text-3xl font-extrabold text-on-surface">
            1,284
          </p>
          <p className="font-label-sm text-xs font-semibold text-on-surface-variant/60 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">info</span>
            Sample data
          </p>
        </div>

        {/* Total Employees */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Total Workforce
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-700">
              <span className="material-symbols-outlined text-lg">
                badge
              </span>
            </span>
          </div>
          {employeesLoading ? (
            <div className="h-9 w-16 rounded-lg bg-surface-container-high animate-pulse" />
          ) : (
            <p className="font-headline-md text-3xl font-extrabold text-on-surface">
              {totalEmployees ?? 0}
            </p>
          )}
          <p className="font-label-sm text-xs font-semibold text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">group</span>
            Across all branches
          </p>
        </div>

        {/* Total Branches */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Active Branches
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700">
              <span className="material-symbols-outlined text-lg">
                domain
              </span>
            </span>
          </div>
          {branchesLoading ? (
            <div className="h-9 w-16 rounded-lg bg-surface-container-high animate-pulse" />
          ) : (
            <p className="font-headline-md text-3xl font-extrabold text-on-surface">
              {String(totalBranches ?? 0).padStart(2, "0")}
            </p>
          )}
          <p className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-emerald-600">
              check_circle
            </span>
            All operational
          </p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (Simple Performance Visualizer) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Lead & Revenue Trends
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Sample data — connect the leads module to see real trends.
                </p>
              </div>
            </div>

            {/* Clean Custom Bar Visualizer (Dummy Graph) */}
            <div className="pt-4 pb-2 space-y-4">
              <div className="flex items-end justify-between gap-2 sm:gap-6 h-48 px-2 border-b border-outline-variant/30">
                {[
                  { month: "May", height: "40%", leads: "210" },
                  { month: "Jun", height: "55%", leads: "340" },
                  { month: "Jul", height: "70%", leads: "480" },
                  { month: "Aug", height: "60%", leads: "410" },
                  { month: "Sep", height: "85%", leads: "590" },
                  { month: "Oct", height: "100%", leads: "680" },
                ].map((bar, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity font-label-sm text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {bar.leads}
                    </div>
                    <div
                      className="w-full max-w-9 bg-primary/80 group-hover:bg-primary rounded-t-lg transition-all"
                      style={{ height: bar.height }}
                    />
                    <span className="font-label-sm text-xs text-on-surface-variant/70 mt-1">
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 pt-2 font-label-sm text-xs text-on-surface-variant">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-primary" />
                  Monthly Lead Inflow
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-surface-container-high" />
                  Target Baseline
                </span>
              </div>
            </div>
          </div>

          {/* High Value Recent Leads Table */}
          <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
            <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                High Value Pipeline
              </h3>
              <span className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 bg-surface-container px-2 py-0.5 rounded-md">
                Sample data
              </span>
            </div>

            <div className="divide-y divide-outline-variant/20">
              {MOCK_RECENT_LEADS.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-label-md text-sm font-bold text-on-surface">
                      {lead.name}
                    </p>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      {lead.company} • {lead.branch}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-label-md text-sm font-bold text-on-surface">
                        {lead.value}
                      </p>
                      <span className="inline-block rounded-full bg-sky-500/10 px-2 py-0.5 font-label-sm text-[10px] font-semibold text-sky-700">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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

      <BranchFormModal
        key={isCreateBranchOpen ? "open" : "closed"}
        open={isCreateBranchOpen}
        branch={null}
        onClose={() => setIsCreateBranchOpen(false)}
      />
    </div>
  );
};

export default HeadDashboardPage;
