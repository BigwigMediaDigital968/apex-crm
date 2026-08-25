import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "@/store/auth.store";
import { useLeads, useMyFollowUps } from "@/features/leads/hooks/useLeads";
import { useAttendanceRecords, useCheckIn, useCheckOut } from "@/features/attendance/hooks/useAttendance";
import { todayInput } from "@/utils/Date";

interface CallLog {
  id: string;
  name: string;
  timeAgo: string;
  type: "missed" | "outgoing" | "inbound";
  notes: string;
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const isFollowUpOverdue = (scheduledAt: string) =>
  new Date(scheduledAt).getTime() < Date.now();

const MOCK_CALL_LOGS: CallLog[] = [
  {
    id: "1",
    name: "Vikram Rathore",
    timeAgo: "10 mins ago",
    type: "missed",
    notes: "Missed call. Lead source: Website. Need to call back...",
  },
  {
    id: "2",
    name: "Sanjay Mehra",
    timeAgo: "1 hr ago",
    type: "outgoing",
    notes: '"Interested in Bulk Discount. Asked for pricing sheet..."',
  },
  {
    id: "3",
    name: "Kiran Bajaj",
    timeAgo: "3 hrs ago",
    type: "inbound",
    notes: "Inbound inquiry. Budget: ₹5L. Hot lead transfer from team.",
  },
];

const EmployeeDashboardPage = () => {
  const [markedIn, setMarkedIn] = useState(false);
  const [scratchpadText, setScratchpadText] = useState("");

  const currentUser = useAuthStore((s) => s.user);
  const firstName = currentUser?.name?.split(" ")[0] ?? "there";

  const { data: myLeadsData, isLoading: leadsLoading } = useLeads({
    assignedTo: currentUser?._id,
    limit: 100,
  });
  const myLeads = useMemo(() => myLeadsData?.leads ?? [], [myLeadsData]);
  const leadsTotal = myLeadsData?.pagination.total ?? myLeads.length;
  const newLeadsToday = useMemo(() => {
    const today = new Date().toDateString();
    return myLeads.filter((l) => new Date(l.createdAt).toDateString() === today).length;
  }, [myLeads]);

  const { data: followUps, isLoading: followUpsLoading } = useMyFollowUps();
  const pendingFollowUps = useMemo(
    () =>
      [...(followUps ?? [])].sort(
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      ),
    [followUps]
  );
  const overdueFollowUps = useMemo(
    () => pendingFollowUps.filter((f) => isFollowUpOverdue(f.scheduledAt)).length,
    [pendingFollowUps]
  );

  const today = todayInput();


  const { data, isLoading:isAttendanceLoading, isFetching } = useAttendanceRecords({
    date: today,
    employeeId: currentUser?._id,
    page: 1,
    limit: 10,
  });
  const todaysRecord = data?.records.find((r) => r.date === today);

  // Mutators for Punch In / Out
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  const isCheckedIn = Boolean(todaysRecord?.checkInAt && !todaysRecord?.checkOutAt);
  const isCheckedOut = Boolean(todaysRecord?.checkOutAt);

  const handlePunchAction = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const payload = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        if (isCheckedIn) {
          checkOutMutation.mutate(payload);
        } else {
          checkInMutation.mutate(payload);
        }
      },
      (error) => {
        alert(`Location permission required for punching: ${error.message}`);
      }
    );
  };

  const status = isCheckedOut
  ? { label: "Checked Out", color: "bg-blue-500", text: "text-blue-600" }
  : isCheckedIn
    ? { label: "Marked In", color: "bg-emerald-500", text: "text-emerald-600" }
    : { label: "Not Marked Yet", color: "bg-error", text: "text-error" };

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-headline-md text-3xl font-bold text-on-surface">
            Namaste, {firstName}.{" "}
            <span className="text-on-surface-variant/60 font-normal">
              Ready for the hustle?
            </span>
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            {pendingFollowUps.length > 0
              ? `${pendingFollowUps.length} follow-up${pendingFollowUps.length > 1 ? "s" : ""} waiting for you${overdueFollowUps > 0 ? `, ${overdueFollowUps} overdue` : ""
              }.`
              : "No pending follow-ups — you're all caught up."}
          </p>
        </div>

        {/* Daily Attendance Card */}
        <div className="flex items-center justify-between gap-6 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm shrink-0 self-start">
          <div>
            <p className="font-label-md text-xs text-on-surface-variant">
              Daily Attendance
            </p>
            <p className={`mt-0.5 flex items-center gap-1.5 text-xs font-semibold ${status.text}`}>
  <span className={`h-2 w-2 rounded-full ${status.color}`} />
  {status.label}
</p>
          </div>
          <div className="w-full lg:w-auto">
            <button
              type="button"
              disabled={
                checkInMutation.isPending ||
                checkOutMutation.isPending ||
                isCheckedOut || isAttendanceLoading
              }
              onClick={handlePunchAction}
              className={`w-full lg:w-auto flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-label-md text-xs font-bold text-on-primary shadow-sm transition-all ${isCheckedOut
                ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                : isCheckedIn
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : "bg-primary hover:bg-primary/90 text-white"
                }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isCheckedOut
                  ? "verified"
                  : isCheckedIn
                    ? "logout"
                    : "fingerprint"}
              </span>
              <span>
                {checkInMutation.isPending || checkOutMutation.isPending
                  ? "Processing Location..."
                  : isCheckedOut
                    ? "Day Completed"
                    : isCheckedIn
                      ? "Check Out Now"
                      : "Check In Now"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* My Leads */}
        <Link
          to="/leads"
          className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm hover:border-primary/40 transition-colors"
        >
          <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            My Leads
          </p>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface mt-1">
            {leadsLoading ? "—" : leadsTotal}
          </p>
          <p className="font-label-sm text-xs font-semibold text-primary mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            {leadsLoading ? "Loading…" : `+${newLeadsToday} New today`}
          </p>
          <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-7xl text-on-surface-variant/5 pointer-events-none">
            group
          </span>
        </Link>

        {/* Follow-ups */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm">
          <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            Follow-ups
          </p>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface mt-1">
            {followUpsLoading ? "—" : pendingFollowUps.length}
          </p>
          {!followUpsLoading && overdueFollowUps > 0 ? (
            <p className="font-label-sm text-xs font-bold text-error mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">priority_high</span>
              ! {overdueFollowUps} Overdue
            </p>
          ) : (
            <p className="font-label-sm text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              {followUpsLoading ? "Loading…" : "None overdue"}
            </p>
          )}
          <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-7xl text-on-surface-variant/5 pointer-events-none">
            calendar_today
          </span>
        </div>

        {/* Calls Today */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-surface-container-lowest p-5 shadow-sm border-b-2 border-b-primary">
          <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            Calls Today
          </p>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface mt-1">
            20
          </p>
          <p className="font-body-sm text-xs text-on-surface-variant mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-emerald-600">
              check_circle
            </span>
            Goal: 40 calls
          </p>
          <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-7xl text-on-surface-variant/5 pointer-events-none">
            call
          </span>
        </div>

        {/* Active Tasks */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm">
          <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            Active Tasks
          </p>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface mt-1">
            04
          </p>
          <p className="font-body-sm text-xs text-on-surface-variant mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>
            2 Due by EOD
          </p>
          <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-7xl text-on-surface-variant/5 pointer-events-none">
            task_alt
          </span>
        </div>
      </div>

      {/* Main Grid: Left Column (Target & Follow-ups), Right Column (Scratchpad & Call Logs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Span (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Monthly Sales Target Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/95 to-primary/80 p-6 sm:p-8 text-on-primary shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-headline-sm text-xl font-bold">
                  Monthly Sales Target
                </h2>
                <p className="font-body-sm text-xs text-on-primary/70 mt-0.5">
                  Quarter 3 Revenue Performance
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="font-headline-md text-3xl font-extrabold tracking-tight">
                  ₹7.8L{" "}
                  <span className="text-lg font-normal text-on-primary/60">
                    / ₹10.0L
                  </span>
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-sky-300 transition-all duration-500"
                  style={{ width: "78%" }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-label-sm text-xs font-bold tracking-wider uppercase text-sky-200">
                  78% Completed
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-label-sm text-[11px] backdrop-blur-md">
                  <span className="material-symbols-outlined text-sm text-amber-300">
                    stars
                  </span>
                  Incentive Tier 2 Unlocked
                </span>
              </div>
            </div>
          </div>

          {/* Today's Follow-ups Card */}
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">
                  edit_calendar
                </span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Pending Follow-ups
                </h3>
              </div>
              <Link to="/leads" className="font-label-md text-xs font-bold text-primary hover:underline">
                View All Leads
              </Link>
            </div>

            {/* Follow-up Items */}
            {followUpsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-surface-container-high animate-pulse" />
                ))}
              </div>
            ) : pendingFollowUps.length === 0 ? (
              <p className="py-6 text-center font-body-sm text-xs text-on-surface-variant/70">
                Nothing scheduled — you're all caught up.
              </p>
            ) : (
              <div className="divide-y divide-outline-variant/20">
                {pendingFollowUps.slice(0, 6).map((item) => {
                  const lead = typeof item.lead === "string" ? null : item.lead;
                  const overdue = isFollowUpOverdue(item.scheduledAt);

                  return (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 last:pb-0"
                    >
                      {/* Lead Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-label-md text-xs font-bold text-primary">
                          {lead ? initialsOf(lead.name) : "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-label-md text-sm font-bold text-on-surface truncate">
                            {lead?.name ?? "Unknown lead"}
                          </p>
                          <p className="font-body-sm text-xs text-on-surface-variant truncate">
                            {lead?.city ?? "—"}
                            {item.remark ? ` • ${item.remark}` : ""}
                          </p>
                        </div>
                      </div>

                      {/* Meta & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div>
                          <p className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">
                            {overdue ? "Overdue since" : "Scheduled"}
                          </p>
                          <p
                            className={`font-label-md text-xs font-bold ${overdue ? "text-error" : "text-on-surface"
                              }`}
                          >
                            {new Date(item.scheduledAt).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>

                        {lead && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-1.5 rounded-xl bg-sky-900 hover:bg-sky-950 px-4 py-2 font-label-md text-xs font-bold text-white shadow-sm transition-all shrink-0"
                          >
                            <span className="material-symbols-outlined text-base">
                              call
                            </span>
                            <span>Call Now</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Span (1 Column) */}
        <div className="space-y-6">

          {/* Scratchpad Card */}
          <div className="rounded-2xl bg-sky-50/70 border border-sky-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-900">
                <span className="material-symbols-outlined text-lg">
                  edit_note
                </span>
                <h3 className="font-label-md text-sm font-bold">Scratchpad</h3>
              </div>
              <span className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-200/60 px-2 py-0.5 rounded-md">
                Autosaved
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Jot down quick details from calls..."
              value={scratchpadText}
              onChange={(e) => setScratchpadText(e.target.value)}
              className="w-full bg-transparent font-body-sm text-xs text-sky-950 placeholder:text-sky-800/40 outline-none resize-none"
            />
          </div>

          {/* Call Logs Card */}
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 space-y-4 shadow-sm">
            <h3 className="font-headline-sm text-base font-bold text-on-surface">
              Call Logs
            </h3>

            <div className="space-y-4">
              {MOCK_CALL_LOGS.map((log) => (
                <div key={log.id} className="flex gap-3">
                  {/* Call Status Icon */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${log.type === "missed"
                      ? "bg-error/10 text-error"
                      : "bg-sky-500/10 text-sky-700"
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {log.type === "missed"
                        ? "call_missed"
                        : log.type === "outgoing"
                          ? "call_made"
                          : "call_received"}
                    </span>
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-label-md text-xs font-bold text-on-surface">
                        {log.name}
                      </p>
                      <span className="font-body-sm text-[10px] text-on-surface-variant/60">
                        {log.timeAgo}
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant/80 italic line-clamp-2">
                      {log.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center border-t border-outline-variant/20">
              <button className="font-label-md text-xs font-bold text-primary hover:underline">
                View Full History
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboardPage;