import { Link } from "react-router";
import { useLeads, useMyFollowUps } from "@/features/leads/hooks/useLeads";
import { useEmployeesQuery } from "@/features/employees";
import { useRevenueReportQuery } from "@/features/revenue/hooks/useRevenue";
import TaskOverviewWidget from "@/features/tasks/components/TaskOverviewWidget";
import { REVENUE_STATUS, type RevenueStatusSummary } from "@/types/revenue";

const formatInr = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

const ManagerDashboard = () => {
  const { data: leadsData, isLoading: leadsLoading } = useLeads({ limit: 1 });
  const { data: employeesData, isLoading: employeesLoading } = useEmployeesQuery({ limit: 6 });
  const { data: revenueData, isLoading: revenueLoading } = useRevenueReportQuery({
    viewMode: "TEAM",
  });
  const { data: followUps, isLoading: followUpsLoading } = useMyFollowUps();

  const verifiedRevenue = Array.isArray(revenueData?.summary)
    ? (revenueData.summary as RevenueStatusSummary[]).find(
        (s) => s._id === REVENUE_STATUS.VERIFIED
      )?.totalAmount ?? 0
    : 0;

  const pendingFollowUps = (followUps ?? []).filter((f) => f.status === "PENDING");

  const stats = [
    {
      title: "Total Leads",
      value: leadsLoading ? "…" : String(leadsData?.pagination.total ?? 0),
      icon: "filter_alt",
      color: "text-sky-600 bg-sky-500/10",
    },
    {
      title: "Verified Revenue",
      value: revenueLoading ? "…" : formatInr(verifiedRevenue),
      icon: "payments",
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      title: "Team Size",
      value: employeesLoading ? "…" : String(employeesData?.pagination.total ?? 0),
      icon: "badge",
      color: "text-indigo-600 bg-indigo-500/10",
    },
    {
      title: "Pending Follow-ups",
      value: followUpsLoading ? "…" : String(pendingFollowUps.length),
      icon: "schedule",
      color: "text-amber-600 bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

      {/* Dashboard Top Header */}
      <div className="border-b border-outline-variant/30 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Manager Control Center
        </span>
        <h1 className="font-headline-md text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
          Branch Operations & Team Dashboard
        </h1>
        <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-0.5">
          Live pipeline, team, and follow-up snapshot for your branch.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {stat.title}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}>
                <span className="material-symbols-outlined text-xl">{stat.icon}</span>
              </div>
            </div>
            <div className="text-2xl font-extrabold text-on-surface">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Section (2 Columns): Team Directory & Task Overview */}
        <div className="lg:col-span-2 space-y-6">

          {/* Team Directory */}
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div>
                <h2 className="font-headline-sm text-base font-bold text-on-surface">
                  Team Directory
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  People on your branch roster
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">group</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low/50 font-label-md text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3">Branch</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-xs font-body-sm">
                  {employeesLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={4} className="py-3 px-3">
                          <div className="h-6 rounded-lg bg-surface-container-high animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : (employeesData?.employees ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 px-3 text-center text-on-surface-variant">
                        No team members found.
                      </td>
                    </tr>
                  ) : (
                    employeesData!.employees.map((member) => (
                      <tr key={member._id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-on-surface">{member.name}</div>
                          <div className="text-[11px] text-on-surface-variant/70">{member.role}</div>
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant">
                          {member.branches[0]?.name ?? "—"}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${member.isActive
                                ? "bg-emerald-500/10 text-emerald-700"
                                : "bg-rose-500/10 text-rose-700"
                              }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${member.isActive ? "bg-emerald-500" : "bg-rose-500"}`}
                            />
                            {member.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Link
                            to={`/employees/${member._id}/profile`}
                            className="inline-flex items-center gap-1 rounded-lg border border-outline-variant/50 bg-surface-container-low px-2.5 py-1 text-[11px] font-bold text-on-surface hover:bg-primary hover:text-on-primary transition-all"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Link
              to="/employees"
              className="block w-full py-2 text-center font-label-md text-xs font-bold text-primary hover:underline"
            >
              View All Employees →
            </Link>
          </div>

          <TaskOverviewWidget
            title="Task Overview"
            description="Task load across your branch."
          />

        </div>

        {/* Right Section (1 Column): Follow-ups & Shortcuts */}
        <div className="space-y-6">

          {/* Pending Follow-ups */}
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h2 className="font-headline-sm text-base font-bold text-on-surface">
                Your Pending Follow-ups
              </h2>
              <span className="material-symbols-outlined text-on-surface-variant">schedule</span>
            </div>

            <div className="space-y-3">
              {followUpsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-surface-container-high animate-pulse" />
                ))
              ) : pendingFollowUps.length === 0 ? (
                <p className="py-4 text-center font-body-sm text-xs text-on-surface-variant/70">
                  No pending follow-ups — all caught up.
                </p>
              ) : (
                pendingFollowUps.slice(0, 5).map((item) => {
                  const lead = typeof item.lead === "object" ? item.lead : null;
                  return (
                    <div
                      key={item._id}
                      className="rounded-xl border border-outline-variant/30 bg-surface-container-low/40 p-3 space-y-2 hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-on-surface">
                          {lead?.name ?? "Lead"}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-700">
                          {lead?.status ?? item.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-on-surface-variant flex items-center justify-between">
                        <span>{lead?.phone ?? ""}</span>
                        <span className="font-mono font-medium">
                          {new Date(item.scheduledAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <Link
              to="/leads"
              className="block w-full text-center text-xs font-bold text-primary hover:underline pt-1"
            >
              View All Leads →
            </Link>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-3">
            <h3 className="font-headline-sm text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Management Shortcuts
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/leads"
                className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low p-2.5 text-xs font-bold text-on-surface hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-primary text-base">person_add</span>
                <span>Leads</span>
              </Link>

              <Link
                to="/tasks/new"
                className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low p-2.5 text-xs font-bold text-on-surface hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-primary text-base">add_task</span>
                <span>Create Task</span>
              </Link>

              <Link
                to="/revenue/create"
                className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low p-2.5 text-xs font-bold text-on-surface hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-primary text-base">payments</span>
                <span>Log Revenue</span>
              </Link>

              <Link
                to="/performance"
                className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low p-2.5 text-xs font-bold text-on-surface hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-primary text-base">analytics</span>
                <span>Reports</span>
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ManagerDashboard;
