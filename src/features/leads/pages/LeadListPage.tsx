import { useState } from "react";
import { useCreateLead, useImportLeads, useLeads } from "../hooks/useLeads";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { CreateLeadPayload } from "@/types/lead";
import { useBranchesQuery } from "@/features/branches";
import { Can } from "@/components/Auth/Can";

// --- TYPES ---


const PAGE_SIZE = 15

const STATUS_TABS = ["All Statuses", "New Lead", "Interested", "Attempted", "Qualified", "Closed"];
const SOURCE_OPTIONS = ["All Sources", "Facebook Ads", "Newsletter", "Referral", "Website Inbound", "Cold Call"];

const LeadListPage = () => {
  // Navigation & Filtering States
  const params = new URLSearchParams(window.location.search);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery);

  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [branchFilter, setBranchFilter] = useState("");

  const createLead = useCreateLead();

  const importLeads = useImportLeads();

  const [importFile, setImportFile] = useState<File | null>(null);
  const [importBranchId, setImportBranchId] = useState("");

  const { data, isLoading, isFetching, isError, error } = useLeads({
    page: currentPage,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    source: selectedSource,
    status: selectedStatus,
    branchId: branchFilter || undefined,
  });

  const leadsData = data?.leads ?? [];
  const pagination = data?.pagination;

  const { data: branches } = useBranchesQuery();




  // Modal Control States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(params.has("new") || false);
  const [creationMethod, setCreationMethod] = useState<"choose" | "manual" | "sheet">("choose");

  // Manual Form State
  const [manualForm, setManualForm] = useState<CreateLeadPayload>({
    name: "",
    phoneCountryCode: "+91",
    phone: "",
    email: "",
    city: "",
    industry: "",
    message: "",
    remarks: "",
    source: "Website",
    sourceType: "MANUAL",
  });

  const handleCreateLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createLead.mutate(manualForm, {
      onSuccess: () => {
        alert("Lead created successfully!");
        closeCreateModal();

        setManualForm({
          name: "",
          phoneCountryCode: "+91",
          phone: "",
          email: "",
          city: "",
          industry: "",
          message: "",
          remarks: "",
          source: "Website",
          sourceType: "MANUAL",
        });
      },
    });
  }

  const handleImportLeads = () => {
    if (!importFile) {
      alert("Please select a CSV or Excel file.");
      return;
    }

    if (!importBranchId) {
      alert("Please select a branch.");
      return;
    }

    importLeads.mutate(
      {
        file: importFile,
        branchId: importBranchId,
      },
      {
        onSuccess: (result) => {
          alert(
            `Import completed!\n\n` +
            `Total: ${result.totalRows}\n` +
            `Successful: ${result.successful}\n` +
            `Duplicates: ${result.duplicates}\n` +
            `Failed: ${result.failed}`
          );

          setImportFile(null);
          closeCreateModal();
        },
      }
    );
  };

  // Toggle Checkboxes
  const toggleSelectLead = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === leadsData?.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leadsData?.map((l: any) => l.id));
    }
  };

  // Reset Modal Function
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreationMethod("choose");
  };

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-6">

      {/* --- TOP BANNER / HEADER --- */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-wider uppercase mb-1">
            <span className="h-0.5 w-4 bg-primary rounded-full" />
            <span>CRM Core Module</span>
          </div>
          <h1 className="font-headline-md text-2xl sm:text-3xl font-extrabold text-on-surface">
            Lead Management Hub
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl">
            Track customer acquisition, assign incoming prospects, and monitor real-time deal flow.
          </p>
        </div>

        <Can permission={'lead:create'}>

          <button
            onClick={() => {
              setCreationMethod("choose");
              setIsCreateModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-label-md text-xs font-bold text-on-primary shadow-sm hover:bg-primary/90 transition-all self-start md:self-auto shrink-0"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Create New Lead</span>
          </button>
        </Can>
      </div>


      {/* --- CONTROL BAR: SEARCH & FILTERS --- */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 shadow-sm">

        {/* Search Field */}
        <div className="relative flex-1 min-w-[280px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant/70">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, company, phone (+91), or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-low pl-10 pr-4 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
          />
        </div>

        {/* Source Dropdown */}
        <div className="relative">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="appearance-none rounded-xl border border-outline-variant/30 bg-surface-container-low px-3.5 py-2 pr-9 text-xs font-semibold text-on-surface outline-none focus:border-primary cursor-pointer transition-all"
          >
            {SOURCE_OPTIONS.map((src) => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>
          <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">
            expand_more
          </span>
        </div>
        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none rounded-xl border border-outline-variant/30 bg-surface-container-low px-3.5 py-2 pr-9 text-xs font-semibold text-on-surface outline-none focus:border-primary cursor-pointer transition-all"
          >
            {STATUS_TABS.map((status) => {
              const count =
                status === "All Statuses"
                  ? leadsData.length
                  : leadsData.filter((l) => l.status === status).length;

              return (
                <option key={status} value={status}>
                  {status} ({count})
                </option>
              );
            })}
          </select>

          {/* Custom Dropdown Chevron Icon */}
          <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">
            expand_more
          </span>
        </div>
        {
          branches && (
            <>
              {console.log("branchFilter", branchFilter)
              }
              <div className="relative">
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="appearance-none rounded-xl border border-outline-variant/30 bg-surface-container-low px-3.5 py-2 pr-9 text-xs font-semibold text-on-surface outline-none focus:border-primary cursor-pointer transition-all"
                >
                  <option key={"All"} value={undefined}>
                    {'All Branch'}
                  </option>
                  {branches.map((branch) => {
                    return (
                      <option key={branch.name} value={branch._id}>
                        {branch.name}
                      </option>
                    );
                  })}
                </select>

                {/* Custom Dropdown Chevron Icon */}
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">
                  expand_more
                </span>
              </div>
            </>
          )
        }


        {/* Clear Filters Button (If active) */}
        {(searchQuery || selectedStatus !== "All Statuses" || selectedSource !== "All Sources") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedStatus("All Statuses");
              setSelectedSource("All Sources");
            }}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline px-2 py-1"
          >
            <span className="material-symbols-outlined text-sm">filter_alt_off</span>
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* --- MAIN DATA TABLE --- */}
      <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">

        {/* Bulk Action Floating Overlay Bar */}
        {selectedLeads.length > 0 && (
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between bg-primary px-6 py-3 text-on-primary animate-in fade-in slide-in-from-top duration-200">
            <span className="text-xs font-bold">
              {selectedLeads.length} Lead{selectedLeads.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 rounded-lg bg-on-primary/10 px-3 py-1.5 text-xs font-bold hover:bg-on-primary/20 transition-colors">
                <span className="material-symbols-outlined text-sm">assignment_ind</span>
                Reassign
              </button>
              <button className="flex items-center gap-1 rounded-lg bg-rose-500/80 px-3 py-1.5 text-xs font-bold hover:bg-rose-600 transition-colors">
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedLeads([])}
                className="ml-2 text-xs hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-low/50">
                <th className="px-5 py-3.5 w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedLeads.length === leadsData.length &&
                      leadsData.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/30 accent-primary cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Lead Details
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Company & Source
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Pipeline Status
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Priority
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Assigned To
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Follow-up Schedule
                </th>
                <th className="px-4 py-3.5 w-10" />
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant/20 text-xs">
              {isLoading || isFetching ? (
                // Loading State
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    {/* Checkbox */}
                    <td className="px-5 py-4">
                      <div className="h-4 w-4 rounded bg-surface-container-high" />
                    </td>

                    {/* Lead Details */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-4 w-32 rounded bg-surface-container-high" />
                        <div className="h-3 w-24 rounded bg-surface-container-high" />
                        <div className="h-2.5 w-40 rounded bg-surface-container-high" />
                      </div>
                    </td>

                    {/* Location / Industry */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-4 w-24 rounded bg-surface-container-high" />
                        <div className="h-3 w-28 rounded bg-surface-container-high" />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="h-6 w-20 rounded-full bg-surface-container-high" />
                    </td>

                    {/* Source */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-4 w-24 rounded bg-surface-container-high" />
                        <div className="h-3 w-20 rounded bg-surface-container-high" />
                      </div>
                    </td>

                    {/* Assigned Rep */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-surface-container-high" />
                        <div className="h-4 w-20 rounded bg-surface-container-high" />
                      </div>
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-4 w-20 rounded bg-surface-container-high" />
                        <div className="h-3 w-14 rounded bg-surface-container-high" />
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-4">
                      <div className="ml-auto h-7 w-7 rounded-lg bg-surface-container-high" />
                    </td>
                  </tr>
                ))
              ) : isError && error ? (
                // Error State
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10">
                        <span className="material-symbols-outlined text-2xl text-rose-500">
                          error
                        </span>
                      </div>

                      <p className="font-bold text-sm text-on-surface">
                        Failed to load leads
                      </p>

                      <p className="mt-1 max-w-sm text-xs text-on-surface-variant/70">
                        {error?.message || "Something went wrong while fetching your leads."}
                      </p>

                      {/* <button
                        type="button"
                        onClick={us}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-bold text-on-primary transition-colors hover:bg-primary/90"
                      >
                        <span className="material-symbols-outlined text-sm">
                          refresh
                        </span>
                        Try Again
                      </button> */}
                    </div>
                  </td>
                </tr>
              ) : leadsData.length > 0 ? (
                // Data State
                leadsData.map((lead) => {
                  const isSelected = selectedLeads.includes(lead._id);

                  return (
                    <tr
                      key={lead._id}
                      className={`group transition-colors ${isSelected
                          ? "bg-primary/5"
                          : "hover:bg-surface-container-low/40"
                        }`}
                    >
                      {/* Checkbox */}
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectLead(lead._id)}
                          className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/30 accent-primary cursor-pointer"
                        />
                      </td>

                      {/* Lead Details */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors cursor-pointer">
                            {lead.name}
                          </p>

                          <p className="text-on-surface-variant/80 font-medium">
                            {lead.phoneCountryCode} {lead.phone}
                          </p>

                          {lead.email && (
                            <p className="text-[11px] text-on-surface-variant/70">
                              {lead.email}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Location / Industry */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-on-surface">
                            {lead.city || "—"}
                          </p>

                          {lead.industry && (
                            <p className="text-[11px] text-on-surface-variant/70 flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-xs">
                                business
                              </span>
                              {lead.industry}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${lead.status === "interested"
                              ? "bg-sky-500/10 text-sky-700"
                              : lead.status === "new"
                                ? "bg-indigo-500/10 text-indigo-700"
                                : lead.status === "qualified"
                                  ? "bg-emerald-500/10 text-emerald-700"
                                  : lead.status === "converted"
                                    ? "bg-green-500/10 text-green-700"
                                    : lead.status === "lost"
                                      ? "bg-rose-500/10 text-rose-700"
                                      : lead.status === "follow_up"
                                        ? "bg-amber-500/10 text-amber-700"
                                        : "bg-surface-container-high text-on-surface-variant"
                            }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${lead.status === "interested"
                                ? "bg-sky-500"
                                : lead.status === "new"
                                  ? "bg-indigo-500"
                                  : lead.status === "qualified"
                                    ? "bg-emerald-500"
                                    : lead.status === "converted"
                                      ? "bg-green-500"
                                      : lead.status === "lost"
                                        ? "bg-rose-500"
                                        : lead.status === "follow_up"
                                          ? "bg-amber-500"
                                          : "bg-outline"
                              }`}
                          />

                          {lead.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-on-surface">
                            {lead.source}
                          </p>

                          <p className="text-[11px] text-on-surface-variant/70 flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-xs">
                              hub
                            </span>
                            {lead.sourceType}
                          </p>
                        </div>
                      </td>

                      {/* Assigned Rep */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {false && typeof lead.assignedTo === "object" &&
                            lead.assignedTo ? (
                              <></>
                            // <>
                            //   <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            //     {lead.assignedTo.name
                            //       .split(" ")
                            //       .map((name) => name[0])
                            //       .slice(0, 2)
                            //       .join("")
                            //       .toUpperCase()}
                            //   </span>

                            //   <div>
                            //     <p className="font-semibold text-on-surface">
                            //       {lead.assignedTo.name}
                            //     </p>

                            //     <p className="text-[10px] text-on-surface-variant/70">
                            //       {lead.assignedTo.role}
                            //     </p>
                            //   </div>
                            // </>
                          ) : (
                            <>
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-high text-[10px] font-bold text-on-surface-variant">
                                U
                              </span>

                              <span className="font-semibold text-on-surface-variant">
                                Unassigned
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-on-surface">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </p>

                          <p className="text-[11px] text-on-surface-variant/70">
                            {new Date(lead.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </td>

                      {/* Action Menu */}
                      <td className="px-4 py-4 text-right">
                        <button
                          title="Actions"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                // Empty State
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-4xl mb-2 text-outline">
                      search_off
                    </span>

                    <p className="font-bold text-sm">
                      No matching leads found
                    </p>

                    <p className="text-xs text-on-surface-variant/70 mt-1">
                      Try adjusting your search terms or filter configurations.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION FOOTER --- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-outline-variant/30 px-6 py-4 bg-surface-container-lowest">
          <p className="text-xs text-on-surface-variant font-medium">
            Showing <span className="font-bold text-on-surface">1</span> to{" "}
            <span className="font-bold text-on-surface">{leadsData.length}</span> of{" "}
            <span className="font-bold text-on-surface">{pagination?.totalPages}</span> leads
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <span className="px-3 text-xs font-bold text-on-surface">Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* --- CREATE LEAD MODAL COMPONENT (DUAL PATH: MANUAL vs SHEET) --- */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-2xl space-y-6">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-on-surface">Add New Lead</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Select your preferred ingestion method for new inquiries.
                </p>
              </div>
              <button
                onClick={closeCreateModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* STEP 1: CHOICE SCREEN */}
            {creationMethod === "choose" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                {/* Manual Entry Option */}
                <button
                  onClick={() => setCreationMethod("manual")}
                  className="flex flex-col items-start gap-3 rounded-2xl border-2 border-outline-variant/30 bg-surface-container-low/40 p-5 text-left hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">edit_square</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Manual Entry</h4>
                    <p className="text-xs text-on-surface-variant/70 mt-1">
                      Fill out a quick form to create an individual lead record immediately.
                    </p>
                  </div>
                </button>

                {/* Bulk Sheet Import Option */}
                <button
                  onClick={() => setCreationMethod("sheet")}
                  className="flex flex-col items-start gap-3 rounded-2xl border-2 border-outline-variant/30 bg-surface-container-low/40 p-5 text-left hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl">file_upload</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Import Spreadsheet</h4>
                    <p className="text-xs text-on-surface-variant/70 mt-1">
                      Upload CSV or Excel files to bulk import hundreds of leads at once.
                    </p>
                  </div>
                </button>
              </div>
            )}

            {/* STEP 2A: MANUAL ENTRY FORM */}
            {creationMethod === "manual" && (
              <form
                onSubmit={handleCreateLead}
                className="space-y-4"
              >
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={150}
                      placeholder="e.g. Rahul Sharma"
                      value={manualForm.name}
                      onChange={(e) =>
                        setManualForm({
                          ...manualForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                      Phone Number *
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={manualForm.phoneCountryCode}
                        onChange={(e) =>
                          setManualForm({
                            ...manualForm,
                            phoneCountryCode: e.target.value,
                          })
                        }
                        className="w-20 rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary"
                      />

                      <input
                        type="tel"
                        required
                        minLength={6}
                        maxLength={15}
                        placeholder="9876543210"
                        value={manualForm.phone}
                        onChange={(e) =>
                          setManualForm({
                            ...manualForm,
                            phone: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        className="flex-1 rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                      Email
                    </label>

                    <input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={manualForm.email}
                      onChange={(e) =>
                        setManualForm({
                          ...manualForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                      City
                    </label>

                    <input
                      type="text"
                      maxLength={100}
                      placeholder="e.g. Delhi"
                      value={manualForm.city}
                      onChange={(e) =>
                        setManualForm({
                          ...manualForm,
                          city: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                      Industry
                    </label>

                    <input
                      type="text"
                      maxLength={100}
                      placeholder="e.g. Real Estate"
                      value={manualForm.industry}
                      onChange={(e) =>
                        setManualForm({
                          ...manualForm,
                          industry: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary"
                    />
                  </div>

                  {/* Lead Source */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                      Lead Source *
                    </label>

                    <input type="text"
                      value={"Website / Maual"}
                      disabled={true}
                      title="This field cannot be changed"

                      className="cursor-not-allowed w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary"
                    />
                    {/* <select
                      required
                      value={manualForm.source}
                      onChange={(e) =>
                        setManualForm({
                          ...manualForm,
                          source: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary"
                    >
                      {SOURCE_OPTIONS
                        .filter((s) => s !== "All Sources")
                        .map((src) => (
                          <option key={src} value={src}>
                            {src}
                          </option>
                        ))}
                    </select> */}
                  </div>

                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                    Message
                  </label>

                  <textarea
                    rows={3}
                    maxLength={5000}
                    placeholder="Enter the lead's requirement..."
                    value={manualForm.message}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        message: e.target.value,
                      })
                    }
                    className="w-full resize-none rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary"
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                    Remarks
                  </label>

                  <textarea
                    rows={2}
                    maxLength={2000}
                    placeholder="Add internal remarks..."
                    value={manualForm.remarks}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        remarks: e.target.value,
                      })
                    }
                    className="w-full resize-none rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary"
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4">

                  <button
                    type="button"
                    onClick={() => setCreationMethod("choose")}
                    disabled={createLead.isPending}
                    className="text-xs font-bold text-on-surface-variant hover:underline disabled:opacity-50"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={createLead.isPending}
                    className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-on-primary shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {createLead.isPending ? "Saving..." : "Save Lead"}
                  </button>

                </div>
              </form>
            )}

            {/* STEP 2B: SPREADSHEET DROPZONE */}
            {creationMethod === "sheet" && (
              <div className="space-y-4">

                {/* File Upload */}
                <label
                  htmlFor="lead-import-file"
                  className="block border-2 border-dashed border-outline-variant/60 rounded-2xl bg-surface-container-low/30 p-8 text-center space-y-3 hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mx-auto">
                    <span className="material-symbols-outlined text-2xl">
                      cloud_upload
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-on-surface">
                      Click to upload or drag and drop spreadsheet
                    </p>

                    <p className="text-[11px] text-on-surface-variant/70 mt-0.5">
                      Supports .CSV, .XLSX, or .XLS (Max size: 5MB)
                    </p>
                  </div>

                  <input
                    id="lead-import-file"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      if (file.size > 5 * 1024 * 1024) {
                        alert("File size must be less than 5MB.");
                        e.target.value = "";
                        return;
                      }

                      setImportFile(file);
                    }}
                  />
                </label>

                {/* Selected File */}
                {importFile && (
                  <div className="flex items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                        <span className="material-symbols-outlined">
                          description
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-on-surface">
                          {importFile.name}
                        </p>

                        <p className="text-[10px] text-on-surface-variant">
                          {(importFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setImportFile(null)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-rose-600"
                    >
                      <span className="material-symbols-outlined text-lg">
                        close
                      </span>
                    </button>
                  </div>
                )}

                {/* Branch */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                    Branch *
                  </label>

                  <select
                    value={importBranchId}
                    onChange={(e) => setImportBranchId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary"
                  >
                    <option value="">
                      Select branch
                    </option>

                    {branches?.map((branch) => (
                      <option
                        key={branch._id}
                        value={branch._id}
                      >
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Template */}
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <a
                    href="#download"
                    className="font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">
                      download
                    </span>

                    Download Sample CSV Template
                  </a>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4">

                  <button
                    type="button"
                    onClick={() => setCreationMethod("choose")}
                    disabled={importLeads.isPending}
                    className="text-xs font-bold text-on-surface-variant hover:underline disabled:opacity-50"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    onClick={handleImportLeads}
                    disabled={
                      !importFile ||
                      !importBranchId ||
                      importLeads.isPending
                    }
                    className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {importLeads.isPending ? "Importing..." : "Import Leads"}
                  </button>

                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default LeadListPage;