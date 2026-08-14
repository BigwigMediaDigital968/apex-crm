import { useNavigate } from "react-router";

// Mapped permission badges/counters for quick overview


const AdminDashboardPage = () => {
  const navigate = useNavigate();

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
            Full system control across users, branch assignments, lead sources, and audit logs.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {/* Permission check: report:export */}
          {/* <button
            onClick={() => alert("Exporting full system data log...")}
            className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 font-label-md text-xs font-bold text-on-surface hover:bg-surface-container transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export System Audit</span>
          </button> */}

          {/* Permission check: user:create */}
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
              System Users (`user:*`)
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-lg">manage_accounts</span>
            </span>
          </div>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface">
            148
          </p>
          <p className="font-label-sm text-xs font-medium text-emerald-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            142 Active • 6 Pending
          </p>
        </div>

        {/* Branch Control Stat */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Active Branches (`branch:*`)
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700">
              <span className="material-symbols-outlined text-lg">storefront</span>
            </span>
          </div>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface">
            04
          </p>
          <p className="font-label-sm text-xs font-medium text-on-surface-variant">
            Delhi (HQ), Mumbai, BLR, Pune
          </p>
        </div>

        {/* Lead Sources Stat */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Lead Channels (`lead-source:*`)
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700">
              <span className="material-symbols-outlined text-lg">share_location</span>
            </span>
          </div>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface">
            12
          </p>
          <p className="font-label-sm text-xs font-medium text-on-surface-variant">
            Website, Meta Ads, Referrals...
          </p>
        </div>

        {/* Security Audit Log Count */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Security Logs (`audit:*`)
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-700">
              <span className="material-symbols-outlined text-lg">shield</span>
            </span>
          </div>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface">
            1,240
          </p>
          <p className="font-label-sm text-xs font-bold text-emerald-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">verified</span>
            No system anomalies
          </p>
        </div>

      </div>

      {/* 3. Action Hub Mapped to Admin Permissions */}
      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm space-y-4">
        <h2 className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
          Admin Quick Operations
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

          {/* Employee Management */}
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

          {/* Branch Management */}
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

          {/* Lead Management */}
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

          {/* Activity Logs */}
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

        </div>
      </div>

      {/* 4. Core Management Section (User Management & Audit Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (User Directory Table with Actions) */}
        <div className="lg:col-span-2 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-5 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                User Directory & Access Control
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Manage roles, update statuses (`user:status:update`), and reassign branches.
              </p>
            </div>

            <button className="font-label-md text-xs font-bold text-primary hover:underline self-start sm:self-auto">
              View All Users
            </button>
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
                {[
                  { id: "1", name: "Rahul Desai", email: "rahul@company.com", role: "Sales Manager", branch: "Delhi (HQ)", status: "Active" },
                  { id: "2", name: "Priya Sharma", email: "priya@company.com", role: "Sales Agent", branch: "Mumbai", status: "Active" },
                  { id: "3", name: "Amit Kumar", email: "amit@company.com", role: "HR Manager", branch: "Bengaluru", status: "Inactive" },
                  { id: "4", name: "Neha Singh", email: "neha@company.com", role: "Sales Agent", branch: "Pune", status: "Active" },
                ].map((user) => (
                  <tr key={user.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-label-md font-bold">{user.name}</p>
                        <p className="font-body-sm text-[11px] text-on-surface-variant/70">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-label-sm text-xs font-semibold">
                      {user.role}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant">
                      {user.branch}
                    </td>
                    <td className="py-3.5 px-4">
                      {/* `user:status:update` toggle */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${user.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-700"
                          : "bg-error/10 text-error"
                          }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-error"}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {/* Action buttons with tooltips */}
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit User (`user:update`) */}
                        <div className="relative group">
                          <button
                            aria-label="Edit User"
                            onClick={() => alert(`Edit ${user.name}`)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20">
                            <div className="bg-on-surface text-surface-container-lowest font-label-sm text-[10px] py-1 px-2 rounded shadow-md whitespace-nowrap">
                              Edit User
                            </div>
                          </div>
                        </div>

                        {/* Assign Branch (`user:assign-branch`) */}
                        <div className="relative group">
                          <button
                            aria-label="Assign Branch"
                            onClick={() => alert(`Assign Branch for ${user.name}`)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">location_city</span>
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20">
                            <div className="bg-on-surface text-surface-container-lowest font-label-sm text-[10px] py-1 px-2 rounded shadow-md whitespace-nowrap">
                              Assign Branch
                            </div>
                          </div>
                        </div>

                        {/* Delete User (`user:delete`) */}
                        <div className="relative group">
                          <button
                            aria-label="Delete User"
                            onClick={() => alert(`Delete ${user.name}`)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/30 text-error/80 hover:bg-error/10 hover:text-error transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20">
                            <div className="bg-on-surface text-surface-container-lowest font-label-sm text-[10px] py-1 px-2 rounded shadow-md whitespace-nowrap">
                              Delete User
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Security Audit Trail (`audit:view`, `audit:read`) */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-700 text-xl">security</span>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                Audit Trail Log
              </h3>
            </div>
            <span className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-md">
              Live Feed
            </span>
          </div>

          <div className="space-y-3.5 divide-y divide-outline-variant/10">
            {[
              { id: "1", action: "user:status:update", details: "Admin changed Rahul Desai status to Active", time: "2 mins ago" },
              { id: "2", action: "branch:create", details: "New Branch 'Pune' created by Admin", time: "1 hour ago" },
              { id: "3", action: "user:assign-role", details: "Assigned 'Sales Manager' to Priya S.", time: "3 hours ago" },
              { id: "4", action: "lead-source:create", details: "Added 'Meta Ads Q3' lead channel", time: "Yesterday" },
            ].map((audit) => (
              <div key={audit.id} className="pt-3 first:pt-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[10px] font-bold font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">
                    {audit.action}
                  </span>
                  <span className="font-body-sm text-[10px] text-on-surface-variant/60">
                    {audit.time}
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface">
                  {audit.details}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center border-t border-outline-variant/20">
            <button className="font-label-md text-xs font-bold text-primary hover:underline">
              View All Audit Logs
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardPage;