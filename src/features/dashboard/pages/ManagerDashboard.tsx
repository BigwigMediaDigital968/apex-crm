import { useState } from "react";

// Mock data based on Manager permissions
const MOCK_STATS = [
  {
    title: "Total Leads",
    value: "428",
    subtitle: "+12% this month",
    icon: "filter_alt",
    color: "text-sky-600 bg-sky-500/10",
  },
  {
    title: "Team Revenue",
    value: "₹8,45,000",
    subtitle: "85% of monthly target",
    icon: "payments",
    color: "text-emerald-600 bg-emerald-500/10",
  },
  {
    title: "Pending Tasks",
    value: "34",
    subtitle: "8 high priority",
    icon: "task_alt",
    color: "text-amber-600 bg-amber-500/10",
  },
  {
    title: "Team On-duty",
    value: "14 / 16",
    subtitle: "2 absent / on leave",
    icon: "badge",
    color: "text-indigo-600 bg-indigo-500/10",
  },
];

const MOCK_TEAM = [
  { id: "1", name: "Ananya Sharma", role: "Sales Rep", activeLeads: 24, tasksPending: 5, status: "Present" },
  { id: "2", name: "Rohan Verma", role: "Senior Rep", activeLeads: 31, tasksPending: 2, status: "Present" },
  { id: "3", name: "Priya Patel", role: "Sales Rep", activeLeads: 18, tasksPending: 7, status: "On Leave" },
  { id: "4", name: "Vikram Malhotra", role: "Junior Rep", activeLeads: 12, tasksPending: 4, status: "Present" },
];

const MOCK_FOLLOWUPS = [
  { id: "f1", client: "TechCorp Ltd", contact: "Rajesh Kumar", time: " Today, 2:30 PM", type: "Demo Call", status: "Upcoming" },
  { id: "f2", client: "Apex Innovations", contact: "Neha Gupta", time: " Today, 4:00 PM", type: "Contract Review", status: "Urgent" },
  { id: "f3", client: "Global Solutions", contact: "Sanjay Shah", time: " Tomorrow, 11:00 AM", type: "Requirement Gathering", status: "Scheduled" },
];

const ManagerDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "quarter">("month");

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/30 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Manager Control Center
            </span>
          </div>
          <h1 className="font-headline-md text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
            Branch Operations & Team Dashboard
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Real-time pipeline, team workload, and task distribution metrics.
          </p>
        </div>

        {/* Time period filter controls */}
        <div className="flex items-center gap-1 rounded-xl bg-surface-container-low p-1 border border-outline-variant/40 self-start sm:self-auto">
          {(["week", "month", "quarter"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`rounded-lg px-3 py-1.5 font-label-md text-xs font-semibold capitalize transition-all ${
                selectedPeriod === period
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              This {period}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_STATS.map((stat) => (
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
            <div>
              <div className="text-2xl font-extrabold text-on-surface">{stat.value}</div>
              <p className="text-xs text-on-surface-variant/80 font-medium mt-1">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Section (2 Columns): Team Performance & Delegations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Team Workload & Member Overview */}
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div>
                <h2 className="font-headline-sm text-base font-bold text-on-surface">
                  Team Workload & Attendance
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Assign leads and delegate pending tasks to reps
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">group</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low/50 font-label-md text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Active Leads</th>
                    <th className="py-2.5 px-3 text-center">Pending Tasks</th>
                    <th className="py-2.5 px-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-xs font-body-sm">
                  {MOCK_TEAM.map((member) => (
                    <tr key={member.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-on-surface">{member.name}</div>
                        <div className="text-[11px] text-on-surface-variant/70">{member.role}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            member.status === "Present"
                              ? "bg-emerald-500/10 text-emerald-700"
                              : "bg-rose-500/10 text-rose-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              member.status === "Present" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-on-surface">
                        {member.activeLeads}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-on-surface">
                        {member.tasksPending}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg border border-outline-variant/50 bg-surface-container-low px-2.5 py-1 text-[11px] font-bold text-on-surface hover:bg-primary hover:text-on-primary transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">assignment_ind</span>
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance & Revenue Progress Bar */}
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Monthly Target Progression
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Branch goal vs achieved revenue (`revenue:view`)
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-primary">₹8,45,000 / ₹10,00,000</span>
            </div>

            {/* Progress indicator */}
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[84.5%] transition-all duration-500" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-medium">
                <span>0%</span>
                <span>84.5% Completed</span>
                <span>100% Target</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Section (1 Column): Priority Follow-ups & Activities */}
        <div className="space-y-6">
          
          {/* Priority Follow-ups */}
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h2 className="font-headline-sm text-base font-bold text-on-surface">
                Scheduled Follow-ups
              </h2>
              <span className="material-symbols-outlined text-on-surface-variant">schedule</span>
            </div>

            <div className="space-y-3">
              {MOCK_FOLLOWUPS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-outline-variant/30 bg-surface-container-low/40 p-3 space-y-2 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-on-surface">{item.client}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.status === "Urgent"
                          ? "bg-rose-500/10 text-rose-700"
                          : "bg-sky-500/10 text-sky-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant flex items-center justify-between">
                    <span>Contact: {item.contact}</span>
                    <span className="font-mono font-medium">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="w-full text-center text-xs font-bold text-primary hover:underline pt-1"
            >
              View All Follow-ups →
            </button>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-3">
            <h3 className="font-headline-sm text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Management Shortcuts
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low p-2.5 text-xs font-bold text-on-surface hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-primary text-base">person_add</span>
                <span>Create Lead</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low p-2.5 text-xs font-bold text-on-surface hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-primary text-base">add_task</span>
                <span>Create Task</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low p-2.5 text-xs font-bold text-on-surface hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-primary text-base">emoji_events</span>
                <span>Log Award</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low p-2.5 text-xs font-bold text-on-surface hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-primary text-base">analytics</span>
                <span>Reports</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ManagerDashboard;