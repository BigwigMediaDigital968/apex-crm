import { Link, useLocation } from "react-router";

import { ROUTES } from "@/config/routes";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuthStore } from "@/store/auth.store";
import { useCallStore } from "@/store/call.store";
import { PERMISSIONS, ROLES } from "@/types/auth";
import { DAILY_REPORT_WINDOW_STATE } from "@/types/dailyReport";
import { useReportWindow } from "../hooks/useDailyReports";
import { formatRemaining, useServerNow } from "../utils";

/**
 * Floating reminder for employees while today's report is due. It stays up,
 * with no dismiss button, until the report is submitted or the deadline
 * passes, and it stacks above the active-call bar so neither covers the
 * other. It's hidden on the report pages, which show their own countdown.
 */
const DailyReportReminder = () => {
  const isEmployee = useAuthStore((s) => s.user?.role === ROLES.EMPLOYEE);
  const { hasPermission, isLoading } = usePermissions();
  const enabled =
    isEmployee && !isLoading && hasPermission(PERMISSIONS.DAILY_REPORT_CREATE);

  const { pathname } = useLocation();
  const callState = useCallStore((s) => s.callState);

  const { data: reportWindow } = useReportWindow(enabled);
  const now = useServerNow(reportWindow?.clockOffsetMs);

  if (!enabled || !reportWindow || reportWindow.report) return null;

  const isLate = reportWindow.state === DAILY_REPORT_WINDOW_STATE.LATE;
  const isOpen = reportWindow.state === DAILY_REPORT_WINDOW_STATE.OPEN;
  if (!isOpen && !isLate) return null;

  if (
    pathname === ROUTES.dailyReport ||
    pathname === ROUTES.dailyReportHistory
  ) {
    return null;
  }

  const deadline = new Date(
    isLate ? reportWindow.lateUntil : reportWindow.closesAt
  ).getTime();
  const remaining = deadline - now;
  if (remaining <= 0) return null;

  // Same condition ActiveCallPopup uses to show itself at bottom-6.
  const callBarVisible =
    (callState === "calling" ||
      callState === "ringing" ||
      callState === "active") &&
    !pathname.startsWith("/dialer");

  const title = isLate ? "Daily report overdue" : "Daily report submission opened";
  const subtitle = isLate
    ? `Marked late · closes in ${formatRemaining(remaining)}`
    : `Due in ${formatRemaining(remaining)}`;

  // A compact round button so it doesn't cover form actions; the full message
  // shows as a tooltip on hover or keyboard focus.
  return (
    <Link
      to={ROUTES.dailyReport}
      role="status"
      aria-label={`${title}. ${formatRemaining(remaining)} left. Open the form.`}
      className={`group fixed right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl ring-4 transition-all duration-200 hover:scale-110 hover:shadow-2xl focus-visible:scale-110 focus-visible:outline-none sm:right-6 ${
        callBarVisible ? "bottom-28" : "bottom-6"
      } ${
        isLate
          ? "bg-amber-600 text-white ring-amber-200 hover:bg-amber-500"
          : "bg-primary text-on-primary ring-primary-fixed hover:bg-primary-container"
      }`}
    >
      {/* Attention halo */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-full motion-safe:animate-ping group-hover:hidden ${
          isLate ? "bg-amber-500/50" : "bg-primary/40"
        }`}
      />

      <span
        aria-hidden="true"
        className="material-symbols-outlined relative text-[26px] motion-safe:animate-nudge group-hover:animate-none"
      >
        {isLate ? "assignment_late" : "edit_note"}
      </span>

      {/* Countdown badge */}
      <span
        aria-hidden="true"
        className={`absolute -top-1.5 -left-1.5 rounded-full bg-white px-1.5 py-0.5 font-label-sm text-[10px] font-bold leading-none shadow ring-1 tabular-nums ${
          isLate ? "text-amber-700 ring-amber-200" : "text-primary ring-primary-fixed"
        }`}
      >
        {formatRemaining(remaining)}
      </span>

      {/* Hover / focus tooltip */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full mr-3 w-max max-w-[calc(100vw-6rem)] translate-x-2 rounded-xl bg-inverse-surface px-3 py-2 text-left leading-tight text-inverse-on-surface opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        <span className="block font-label-md text-xs font-bold">{title}</span>
        <span className="block font-body-sm text-[11px] opacity-80 tabular-nums">
          {subtitle} · click to fill
        </span>
      </span>
    </Link>
  );
};

export default DailyReportReminder;
