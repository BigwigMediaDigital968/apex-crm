import { useState, useMemo } from "react";

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  avatar: string;
  designation: string;
  team: string;
  reportingTo: {
    name: string;
    initials: string;
  };
  status: "ACTIVE" | "INACTIVE";
  joiningDate: string;
  score: number;
}

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "1",
    employeeId: "MTX-00124",
    name: "Arjun Sharma",
    email: "arjun.s@marketrixa.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    designation: "Senior Sales Lead",
    team: "ENTERPRISE WEST",
    reportingTo: { name: "Vikram Singh", initials: "VS" },
    status: "ACTIVE",
    joiningDate: "12 Oct, 2021",
    score: 9.2,
  },
  {
    id: "2",
    employeeId: "MTX-00356",
    name: "Priya Iyer",
    email: "priya.i@marketrixa.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    designation: "Product Designer",
    team: "EXPERIENCE UNIT",
    reportingTo: { name: "Rohan Kapoor", initials: "RK" },
    status: "INACTIVE",
    joiningDate: "05 Jan, 2023",
    score: 7.8,
  },
  {
    id: "3",
    employeeId: "MTX-00912",
    name: "Siddharth Nair",
    email: "sid.n@marketrixa.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    designation: "Backend Engineer",
    team: "INFRASTRUCTURE",
    reportingTo: { name: "Ananya K.", initials: "AK" },
    status: "ACTIVE",
    joiningDate: "22 Jul, 2022",
    score: 8.5,
  },
  {
    id: "4",
    employeeId: "MTX-00411",
    name: "Ananya Kulkarni",
    email: "ananya.k@marketrixa.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    designation: "VP of Engineering",
    team: "INFRASTRUCTURE",
    reportingTo: { name: "CEO Office", initials: "CO" },
    status: "ACTIVE",
    joiningDate: "14 Feb, 2020",
    score: 9.6,
  },
];

const DEPARTMENTS = [
  "All Departments",
  "ENTERPRISE WEST",
  "EXPERIENCE UNIT",
  "INFRASTRUCTURE",
];

const EmployeeListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter employees based on search & department
  const filteredEmployees = useMemo(() => {
    return MOCK_EMPLOYEES.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept =
        selectedDept === "All Departments" || emp.team === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [searchQuery, selectedDept]);

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-wider uppercase mb-1">
            <span className="h-0.5 w-4 bg-primary rounded-full" />
            <span>Human Resources</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Organization Directory
          </h1>
          <p className="font-body-md text-on-surface-variant mt-1 max-w-2xl">
            Manage your global workforce, monitor performance metrics, and
            orchestrate team structures across all regional offices.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-label-md text-on-primary shadow-md hover:bg-primary/90 transition-all self-start md:self-auto shrink-0">
          <span className="material-symbols-outlined text-xl">person_add</span>
          <span>Onboard Employee</span>
        </button>
      </div>

      {/* Filter and Metric Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search & Department Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-2xl">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] items-center rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3.5 py-2.5 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-8 font-body-md text-on-surface outline-none placeholder:text-on-surface-variant/60"
            />
          </div>

          {/* Department Select Dropdown */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="appearance-none rounded-xl border border-outline-variant/50 bg-surface-container-low px-4 py-2.5 pr-10 font-label-md text-on-surface outline-none focus:border-primary transition-all"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
              expand_more
            </span>
          </div>
        </div>

        {/* Metrics & Utility Actions */}
        <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-outline-variant/30 pt-3 lg:pt-0">
          <div className="flex items-center gap-6">
            <div>
              <p className="font-label-sm text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/70">
                Total Strength
              </p>
              <p className="font-headline-sm text-headline-sm text-on-surface">
                1,284{" "}
                <span className="font-body-sm text-xs font-medium text-on-surface-variant">
                  Active
                </span>
              </p>
            </div>

            <div className="h-8 w-px bg-outline-variant/40" />

            <div>
              <p className="font-label-sm text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/70">
                Growth Rate
              </p>
              <p className="font-headline-sm text-headline-sm text-secondary flex items-center gap-1">
                +12.4%{" "}
                <span className="font-body-sm text-xs font-medium text-on-surface-variant">
                  MoM
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              title="Filter"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                tune
              </span>
            </button>
            <button
              title="Export CSV"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                download
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-low/50">
                <th className="px-6 py-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant/80">
                  Profile
                </th>
                <th className="px-6 py-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant/80">
                  Employee ID
                </th>
                <th className="px-6 py-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant/80">
                  Designation & Team
                </th>
                <th className="px-6 py-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant/80">
                  Reporting To
                </th>
                <th className="px-6 py-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant/80">
                  Status
                </th>
                <th className="px-6 py-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant/80">
                  Joining Date
                </th>
                <th className="px-6 py-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant/80">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-surface-container-low/40 transition-colors group cursor-pointer"
                  >
                    {/* Profile Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-surface-container-high"
                        />
                        <div>
                          <p className="font-label-md text-on-surface group-hover:text-primary transition-colors">
                            {emp.name}
                          </p>
                          <p className="font-body-sm text-xs text-on-surface-variant/80">
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="px-6 py-4 font-label-md text-xs text-on-surface-variant/90">
                      {emp.employeeId}
                    </td>

                    {/* Designation & Team */}
                    <td className="px-6 py-4">
                      <p className="font-body-md text-xs font-semibold text-on-surface">
                        {emp.designation}
                      </p>
                      <p className="font-label-sm text-[10px] font-bold tracking-wider text-primary uppercase">
                        {emp.team}
                      </p>
                    </td>

                    {/* Reporting Manager */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-fixed text-[11px] font-bold text-on-secondary-fixed">
                          {emp.reportingTo.initials}
                        </span>
                        <span className="font-body-md text-xs text-on-surface">
                          {emp.reportingTo.name}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-label-sm text-[11px] font-semibold ${
                          emp.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-700"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            emp.status === "ACTIVE"
                              ? "bg-emerald-500"
                              : "bg-outline"
                          }`}
                        />
                        {emp.status}
                      </span>
                    </td>

                    {/* Joining Date */}
                    <td className="px-6 py-4 font-body-sm text-xs text-on-surface-variant">
                      {emp.joiningDate}
                    </td>

                    {/* Score Progress Indicator */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-container-high">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${(emp.score / 10) * 100}%` }}
                          />
                        </div>
                        <span className="font-label-md text-xs text-on-surface">
                          {emp.score}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-4xl mb-2 text-outline">
                      search_off
                    </span>
                    <p className="font-body-md">No employees found matching your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-outline-variant/30 px-6 py-4 bg-surface-container-lowest">
          <p className="font-body-sm text-xs text-on-surface-variant">
            Showing <span className="font-medium text-on-surface">1</span> to{" "}
            <span className="font-medium text-on-surface">
              {filteredEmployees.length}
            </span>{" "}
            of <span className="font-medium text-on-surface">1,284</span> employees
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container disabled:opacity-40 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                chevron_left
              </span>
            </button>

            {[1, 2, 3, "...", 129].map((page, idx) => (
              <button
                key={idx}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg font-label-sm text-xs transition-colors ${
                  currentPage === page
                    ? "bg-primary font-bold text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeListPage;