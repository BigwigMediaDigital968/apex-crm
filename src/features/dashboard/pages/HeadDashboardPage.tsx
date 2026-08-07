import { useState } from "react";
import { useModalStore } from "@/store/modal.store"; // Adjust import path
import { Link } from "react-router";

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

const MOCK_BRANCH_METRICS = [
  { name: "Delhi (HQ)", leads: 540, employees: 42, revenue: "₹48.2L" },
  { name: "Mumbai", leads: 380, employees: 28, revenue: "₹32.5L" },
  { name: "Bengaluru", leads: 260, employees: 20, revenue: "₹24.1L" },
  { name: "Pune", leads: 104, employees: 8, revenue: "₹8.4L" },
];

const HeadDashboardPage = () => {
  const openModal = useModalStore((s) => s.openModal);
  const [selectedTimeframe, setSelectedTimeframe] = useState("This Month");

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

          <button className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 font-label-md text-xs font-bold text-on-surface hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined text-lg text-primary">
              add_business
            </span>
            <span>Create Branch</span>
          </button>

          <button className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 font-label-md text-xs font-bold text-on-surface hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined text-lg text-secondary">
              person_search
            </span>
            <span>Add New Lead</span>
          </button>

          {/* Icon-Only Action with UI/UX Tooltip */}
          <div className="relative group ml-auto">
            <button
              aria-label="Export Global Business Report"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                download
              </span>
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-20">
              <div className="bg-on-surface text-surface-container-lowest font-label-sm text-[11px] py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap">
                Export Executive Report
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
          <p className="font-headline-md text-3xl font-extrabold text-on-surface">
            1,284
          </p>
          <p className="font-label-sm text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            +14.2% from last month
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
          <p className="font-headline-md text-3xl font-extrabold text-on-surface">
            98
          </p>
          <p className="font-label-sm text-xs font-semibold text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">group_add</span>
            +6 onboarded this month
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
          <p className="font-headline-md text-3xl font-extrabold text-on-surface">
            04
          </p>
          <p className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-emerald-600">
              check_circle
            </span>
            100% operational efficiency
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
                  Monthly progression across all regional territories.
                </p>
              </div>

              {/* Icon-Only Refresh Action with Tooltip */}
              <div className="relative group">
                <button
                  aria-label="Refresh Graph Data"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    refresh
                  </span>
                </button>
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-20">
                  <div className="bg-on-surface text-surface-container-lowest font-label-sm text-[11px] py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap">
                    Sync Chart Data
                  </div>
                  <div className="w-2 h-2 bg-on-surface rotate-45 absolute right-3 -bottom-1" />
                </div>
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
                      className="w-full max-w-[36px] bg-primary/80 group-hover:bg-primary rounded-t-lg transition-all"
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
              <button className="font-label-md text-xs font-bold text-primary hover:underline">
                View All Leads
              </button>
            </div>

            <div className="divide-y divide-outline-variant/20">
              {MOCK_RECENT_LEADS.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 hover:bg-surface-container-low/30 transition-colors"
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

                    {/* Action Icon with Tooltip */}
                    <div className="relative group">
                      <button
                        aria-label="Inspect Lead Details"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          chevron_right
                        </span>
                      </button>
                      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-20">
                        <div className="bg-on-surface text-surface-container-lowest font-label-sm text-[11px] py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap">
                          View Lead
                        </div>
                        <div className="w-2 h-2 bg-on-surface rotate-45 absolute right-3 -bottom-1" />
                      </div>
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

            <div className="space-y-3">
              {MOCK_BRANCH_METRICS.map((branch, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-outline-variant/30 bg-surface-container-low/40 p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-label-md text-sm font-bold text-on-surface">
                      {branch.name}
                    </p>
                    <span className="font-label-md text-xs font-bold text-primary">
                      {branch.revenue}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-body-sm text-xs text-on-surface-variant/80">
                    <span>{branch.leads} Leads</span>
                    <span>{branch.employees} Employees</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low font-label-md text-xs font-bold text-on-surface hover:bg-surface-container transition-colors">
              Manage All Branches
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeadDashboardPage;