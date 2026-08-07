import { useState } from "react";

interface FollowUp {
  id: string;
  initials: string;
  name: string;
  topic: string;
  location: string;
  time: string;
  priority: "High" | "Medium" | "Low";
}

interface CallLog {
  id: string;
  name: string;
  timeAgo: string;
  type: "missed" | "outgoing" | "inbound";
  notes: string;
}

const MOCK_FOLLOW_UPS: FollowUp[] = [
  {
    id: "1",
    initials: "AS",
    name: "Amit Sharma",
    topic: "Real Estate Investment",
    location: "Mumbai",
    time: "11:30 AM",
    priority: "High",
  },
  {
    id: "2",
    initials: "PJ",
    name: "Priya Jain",
    topic: "Tech Upgrade Project",
    location: "Bengaluru",
    time: "02:45 PM",
    priority: "Medium",
  },
];

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

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <p className="font-label-sm text-xs font-bold uppercase tracking-widest text-primary/80">
            Wednesday, Oct 25
          </p>
          <h1 className="font-headline-md text-3xl font-bold text-on-surface">
            Namaste, Rajesh.{" "}
            <span className="text-on-surface-variant/60 font-normal">
              Ready for the hustle?
            </span>
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            You're only <span className="font-bold text-on-surface">₹2.2L</span> away from your monthly target. 8 high-priority follow-ups are waiting for you.
          </p>
        </div>

        {/* Daily Attendance Card */}
        <div className="flex items-center justify-between gap-6 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm shrink-0 self-start">
          <div>
            <p className="font-label-md text-xs text-on-surface-variant">
              Daily Attendance
            </p>
            <p className="font-label-sm text-xs font-semibold text-error flex items-center gap-1.5 mt-0.5">
              <span className={`h-2 w-2 rounded-full ${markedIn ? "bg-emerald-500" : "bg-error"}`} />
              {markedIn ? "Marked In" : "Not Marked Yet"}
            </p>
          </div>
          <button
            onClick={() => setMarkedIn((prev) => !prev)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-label-md text-xs font-bold text-on-primary shadow-sm transition-all ${
              markedIn
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {markedIn ? "check_circle" : "fingerprint"}
            </span>
            <span>{markedIn ? "Checked In" : "Mark In"}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* My Leads */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm">
          <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            My Leads
          </p>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface mt-1">
            12
          </p>
          <p className="font-label-sm text-xs font-semibold text-primary mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            +2 New today
          </p>
          <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-7xl text-on-surface-variant/5 pointer-events-none">
            group
          </span>
        </div>

        {/* Follow-ups */}
        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm">
          <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            Follow-ups
          </p>
          <p className="font-headline-md text-3xl font-extrabold text-on-surface mt-1">
            08
          </p>
          <p className="font-label-sm text-xs font-bold text-error mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">priority_high</span>
            ! 3 Overdue
          </p>
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
                  Today's Follow-ups
                </h3>
              </div>
              <button className="font-label-md text-xs font-bold text-primary hover:underline">
                View Calendar
              </button>
            </div>

            {/* Follow-up Items */}
            <div className="divide-y divide-outline-variant/20">
              {MOCK_FOLLOW_UPS.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 last:pb-0"
                >
                  {/* Lead Info */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-label-md text-xs font-bold text-primary">
                      {item.initials}
                    </div>
                    <div>
                      <p className="font-label-md text-sm font-bold text-on-surface">
                        {item.name}
                      </p>
                      <p className="font-body-sm text-xs text-on-surface-variant">
                        {item.topic} • {item.location}
                      </p>
                    </div>
                  </div>

                  {/* Meta & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">
                          Time
                        </p>
                        <p className="font-label-md text-xs font-bold text-on-surface">
                          {item.time}
                        </p>
                      </div>

                      <div>
                        <p className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">
                          Priority
                        </p>
                        <p
                          className={`font-label-md text-xs font-bold flex items-center gap-0.5 ${
                            item.priority === "High"
                              ? "text-error"
                              : "text-amber-600"
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {item.priority === "High"
                              ? "priority_high"
                              : "arrow_upward"}
                          </span>
                          {item.priority}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Icon Button with UI/UX Tooltip */}
                      <div className="relative group">
                        <button
                          aria-label="View Call Script & Notes"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">
                            description
                          </span>
                        </button>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                          <div className="bg-on-surface text-surface-container-lowest font-label-sm text-[11px] py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap">
                            View Script & Notes
                          </div>
                          {/* Arrow */}
                          <div className="w-2 h-2 bg-on-surface rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
                        </div>
                      </div>

                      {/* Call Now Action */}
                      <button className="flex items-center gap-1.5 rounded-xl bg-sky-900 hover:bg-sky-950 px-4 py-2 font-label-md text-xs font-bold text-white shadow-sm transition-all">
                        <span className="material-symbols-outlined text-base">
                          call
                        </span>
                        <span>Call Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      log.type === "missed"
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