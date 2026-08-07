import { useState, useMemo } from "react";

interface Lead {
  id: string;
  leadId: string;
  name: string;
  phone: string;
  company: string;
  source: string;
  status: "Interested" | "New Lead" | "Attempted" | "Qualified" | "Closed";
  priority: "HOT" | "MEDIUM" | "LOW";
  assignedTo?: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  nextFollowUp: {
    status: "tomorrow" | "overdue" | "scheduled";
    label: string;
    time: string;
  };
}

const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    leadId: "#LD-9021",
    name: "Rajesh Kumar",
    phone: "+91 98765-43210",
    company: "Innovate Tech Solutions",
    source: "Facebook Ads",
    status: "Interested",
    priority: "HOT",
    assignedTo: {
      name: "Amit Sharma",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    nextFollowUp: {
      status: "tomorrow",
      label: "Tomorrow",
      time: "10:30 AM",
    },
  },
  {
    id: "2",
    leadId: "#LD-8842",
    name: "Priya Deshmukh",
    phone: "+91 91234-56789",
    company: "Global Logistics Co.",
    source: "Newsletter",
    status: "New Lead",
    priority: "MEDIUM",
    assignedTo: {
      name: "Sneha Iyer",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    nextFollowUp: {
      status: "overdue",
      label: "Overdue (Oct 24)",
      time: "02:00 PM",
    },
  },
  {
    id: "3",
    leadId: "#LD-8701",
    name: "Vikram Singh",
    phone: "+91 99887-76655",
    company: "Retail Pulse India",
    source: "Referral",
    status: "Attempted",
    priority: "LOW",
    assignedTo: {
      name: "Unassigned",
      initials: "UK",
    },
    nextFollowUp: {
      status: "scheduled",
      label: "Oct 28",
      time: "11:00 AM",
    },
  },
];

const STATUS_OPTIONS = ["All Statuses", "Interested", "New Lead", "Attempted"];
const SOURCE_OPTIONS = ["All Sources", "Facebook Ads", "Newsletter", "Referral"];

const LeadListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Toggle selection for individual items
  const toggleSelectLead = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle selection for all filtered items
  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map((l) => l.id));
    }
  };

  // Filtered Leads Calculation
  const filteredLeads = useMemo(() => {
    return MOCK_LEADS.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.leadId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "All Statuses" || lead.status === selectedStatus;

      const matchesSource =
        selectedSource === "All Sources" || lead.source === selectedSource;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [searchQuery, selectedStatus, selectedSource]);

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-wider uppercase mb-1">
            <span className="h-0.5 w-4 bg-primary rounded-full" />
            <span>CRM Intelligence</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Lead Pipeline
          </h1>
          <p className="font-body-md text-on-surface-variant mt-1 max-w-2xl">
            Manage and nurture your high-velocity sales pipeline with precision
            tracking and automated follow-up reminders.
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-8 self-start md:self-auto shrink-0 bg-surface-container-lowest border border-outline-variant/30 px-5 py-3 rounded-2xl shadow-sm">
          <div>
            <p className="font-headline-md text-2xl font-bold text-primary">
              1,284
            </p>
            <p className="font-label-sm text-[10px] font-bold tracking-wider text-on-surface-variant/70 uppercase">
              Total Active Leads
            </p>
          </div>
          <div className="h-8 w-px bg-outline-variant/30" />
          <div>
            <p className="font-headline-md text-2xl font-bold text-secondary">
              42
            </p>
            <p className="font-label-sm text-[10px] font-bold tracking-wider text-on-surface-variant/70 uppercase">
              Hot Leads Today
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[260px] items-center rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3.5 py-2.5 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant/70">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name, phone (+91), or Lead ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-8 font-body-md text-on-surface outline-none placeholder:text-on-surface-variant/50"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 pr-10 font-label-md text-sm text-on-surface outline-none focus:border-primary transition-all cursor-pointer"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
              expand_more
            </span>
          </div>

          {/* Source Dropdown */}
          <div className="relative">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="appearance-none rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 pr-10 font-label-md text-sm text-on-surface outline-none focus:border-primary transition-all cursor-pointer"
            >
              {SOURCE_OPTIONS.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
              expand_more
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 font-label-md text-sm text-on-surface hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-xl text-on-surface-variant">
            tune
          </span>
          <span>More Filters</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-low/40">
                <th className="px-5 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedLeads.length === filteredLeads.length &&
                      filteredLeads.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/30 accent-primary cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant/80">
                  Lead Details
                </th>
                <th className="px-6 py-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant/80">
                  Company & Source
                </th>
                <th className="px-6 py-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant/80">
                  Status
                </th>
                <th className="px-6 py-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant/80">
                  Priority
                </th>
                <th className="px-6 py-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant/80">
                  Assigned To
                </th>
                <th className="px-6 py-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant/80">
                  Next Follow-Up
                </th>
                <th className="px-4 py-4 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const isSelected = selectedLeads.includes(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      className={`group transition-colors ${
                        isSelected
                          ? "bg-surface-container-low/80"
                          : "hover:bg-surface-container-low/30"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectLead(lead.id)}
                          className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/30 accent-primary cursor-pointer"
                        />
                      </td>

                      {/* Lead Details */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-label-md text-sm text-on-surface group-hover:text-primary transition-colors cursor-pointer">
                            {lead.name}
                          </p>
                          <p className="font-body-sm text-xs text-on-surface-variant/80">
                            {lead.phone}
                          </p>
                          <p className="font-body-sm text-[10px] text-on-surface-variant/50 font-mono mt-0.5">
                            ID: {lead.leadId}
                          </p>
                        </div>
                      </td>

                      {/* Company & Source */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-body-md text-xs font-semibold text-on-surface">
                            {lead.company}
                          </p>
                          <p className="font-body-sm text-xs text-on-surface-variant/70 flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-sm">
                              share
                            </span>
                            {lead.source}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-label-sm text-xs font-semibold ${
                            lead.status === "Interested"
                              ? "bg-sky-500/10 text-sky-700"
                              : lead.status === "New Lead"
                              ? "bg-indigo-500/10 text-indigo-700"
                              : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              lead.status === "Interested"
                                ? "bg-sky-500"
                                : lead.status === "New Lead"
                                ? "bg-indigo-500"
                                : "bg-outline"
                            }`}
                          />
                          {lead.status}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4">
                        {lead.priority === "HOT" && (
                          <span className="font-bold text-xs text-error flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">
                              priority_high
                            </span>
                            HOT
                          </span>
                        )}
                        {lead.priority === "MEDIUM" && (
                          <span className="font-semibold text-xs text-secondary-container/90 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">
                              drag_handle
                            </span>
                            MEDIUM
                          </span>
                        )}
                        {lead.priority === "LOW" && (
                          <span className="font-medium text-xs text-on-surface-variant/60 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">
                              remove
                            </span>
                            LOW
                          </span>
                        )}
                      </td>

                      {/* Assigned To */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          {lead.assignedTo?.avatar ? (
                            <img
                              src={lead.assignedTo.avatar}
                              alt={lead.assignedTo.name}
                              className="h-7 w-7 rounded-full object-cover ring-1 ring-outline-variant/50"
                            />
                          ) : (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-on-surface-variant">
                              {lead.assignedTo?.initials || "UK"}
                            </span>
                          )}
                          <span className="font-body-md text-xs text-on-surface">
                            {lead.assignedTo?.name || "Unassigned"}
                          </span>
                        </div>
                      </td>

                      {/* Next Follow-Up */}
                      <td className="px-6 py-4">
                        <div>
                          <p
                            className={`font-label-md text-xs font-bold ${
                              lead.nextFollowUp.status === "overdue"
                                ? "text-error"
                                : "text-on-surface"
                            }`}
                          >
                            {lead.nextFollowUp.label}
                          </p>
                          <p className="font-body-sm text-[11px] text-on-surface-variant/70">
                            {lead.nextFollowUp.time}
                          </p>
                        </div>
                      </td>

                      {/* Row Action Dropdown */}
                      <td className="px-4 py-4 text-right">
                        <button
                          title="Actions"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-4xl mb-2 text-outline">
                      folder_off
                    </span>
                    <p className="font-body-md">No leads match your current search criteria.</p>
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
              {filteredLeads.length}
            </span>{" "}
            of <span className="font-medium text-on-surface">1,284</span> leads
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

            {[1, 2, 3, "...", 128].map((page, idx) => (
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

export default LeadListPage;