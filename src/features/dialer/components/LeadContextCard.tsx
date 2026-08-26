// src/features/dialer/components/LeadContextCard.tsx
import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useLead, useLeads } from "@/features/leads/hooks/useLeads"; // adjust path
import type { Lead } from "@/types/lead";

interface LeadContextCardProps {
  phoneNumber: string;
  onSelectLeadPhone?: (phone: string) => void;
}

export const LeadContextCard: React.FC<LeadContextCardProps> = ({
  phoneNumber,
  onSelectLeadPhone,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramLeadId = searchParams.get("leadId") || searchParams.get("phone"); // support ?leadId= or legacy param

  const [searchQuery, setSearchQuery] = useState("");

  // 1. Query Lead directly by ID if param exists in URL
  const { data: directLead, isLoading: isDirectLeadLoading } = useLead(paramLeadId || "");

  console.log("directLead", directLead)

  // 2. Query Leads by search term or typed keypad phone number
  const activeSearch = searchQuery.trim() || phoneNumber.replace(/\D/g, "");
  const { data: searchData, isLoading: isSearchLoading } = useLeads({
    page: 1,
    limit: 5,
    search: activeSearch.length >= 3 ? activeSearch : undefined,
  });

  const matchedLead = useMemo(() => {
    if (paramLeadId && directLead) return directLead;
    if (searchData?.leads?.length) return searchData.leads[0] as Lead;
    return null;
  }, [paramLeadId, directLead, searchData]);

  const handleClearSelectedLead = () => {
    if (paramLeadId) {
      searchParams.delete("leadId");
      searchParams.delete("phone");
      setSearchParams(searchParams);
    }
    setSearchQuery("");
  };

  const handleSelectLead = (lead: Lead) => {
    if (onSelectLeadPhone && lead.phone) {
      onSelectLeadPhone(lead.phone);
    }
  };

  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm space-y-4">
      {/* Panel Header & Search Input */}
      <div className="space-y-3 border-b border-outline-variant/20 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person_search</span>
            <h3 className="font-headline-sm text-base font-bold text-on-surface">
              CRM Lead Intelligence
            </h3>
          </div>
          {(isDirectLeadLoading || isSearchLoading) && (
            <span className="text-[10px] font-semibold text-primary animate-pulse">
              Fetching Lead Data...
            </span>
          )}
        </div>

        {/* Lead Search Input Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search lead by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-low pl-9 pr-8 py-2 text-xs text-on-surface outline-none focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Selected Lead Active View */}
      {matchedLead ? (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 relative">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-headline-sm text-lg font-extrabold text-on-surface">
                  {matchedLead.name}
                </h4>
                {paramLeadId && (
                  <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Direct Linked
                  </span>
                )}
              </div>

              <p className="text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">call</span>
                {matchedLead.phoneCountryCode || "+91"} {matchedLead.phone}
              </p>

              {matchedLead.email && (
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  {matchedLead.email}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold capitalize bg-primary/10 text-primary border border-primary/20">
                {matchedLead.status ? matchedLead.status.replace("_", " ") : "Lead"}
              </span>

              {/* Action to auto-fill phone into keypad */}
              {onSelectLeadPhone && (
                <button
                  type="button"
                  onClick={() => handleSelectLead(matchedLead)}
                  className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                >
                  <span className="material-symbols-outlined text-xs">dialpad</span>
                  Load Number
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/20">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Source
              </p>
              <p className="text-xs font-bold text-on-surface mt-0.5">
                {matchedLead.source || "N/A"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/20">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                City
              </p>
              <p className="text-xs font-bold text-on-surface mt-0.5">
                {matchedLead.city || "N/A"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/20">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Industry
              </p>
              <p className="text-xs font-bold text-on-surface mt-0.5">
                {matchedLead.industry || "N/A"}
              </p>
            </div>
          </div>

          {/* Remarks */}
          {matchedLead.remarks && (
            <div className="p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 space-y-1">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Latest Remarks
              </p>
              <p className="text-xs text-on-surface line-clamp-2">
                {matchedLead.remarks}
              </p>
            </div>
          )}

          {paramLeadId && (
            <button
              type="button"
              onClick={handleClearSelectedLead}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Clear linked lead selection
            </button>
          )}
        </div>
      ) : (
        /* Search Suggestions / Empty State */
        <div className="space-y-3">
          {searchData?.leads && searchData.leads.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Matching Search Results
              </p>
              {searchData.leads.map((l: Lead) => (
                <div
                  key={l._id}
                  onClick={() => handleSelectLead(l)}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high cursor-pointer border border-outline-variant/20 transition-all"
                >
                  <div>
                    <p className="text-xs font-bold text-on-surface">{l.name}</p>
                    <p className="text-[11px] text-on-surface-variant">{l.phone}</p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-base">
                    call
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 border-2 border-dashed border-outline-variant/30 rounded-xl">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
                contact_search
              </span>
              <p className="font-label-md text-xs font-semibold text-on-surface-variant">
                {searchQuery || phoneNumber
                  ? "No matching CRM lead found"
                  : "Search or enter a lead ID parameter in URL to fetch record"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};