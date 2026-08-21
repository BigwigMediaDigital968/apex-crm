import { useEffect, useMemo, useState } from "react";
import { ROLES } from "@/types/auth";
import { useAuthStore } from "@/store/auth.store";
import { useAttendanceRecords, useAttendanceSummary, useCheckIn, useCheckOut } from "../hooks/useAttendance";
import { ATTENDANCE_STATUS, ATTENDANCE_STATUS_LABELS, ATTENDANCE_WORK_MODE_LABELS, type AttendanceStatus } from "@/types/attendance";
import { useBranch } from "@/features/branches";
import { daysAgoInput, formatDate, formatMinutes, formatTime, todayInput } from "@/utils/Date";
import TeamAttendanceTab from "../components/TeamAttendanceTab";

const STATUS_BADGE_CLASSES: Record<AttendanceStatus, string> = {
    present: "bg-emerald-500/10 text-emerald-700",
    late: "bg-amber-500/10 text-amber-700",
    half_day: "bg-sky-500/10 text-sky-700",
    absent: "bg-rose-500/10 text-rose-700",
    on_leave: "bg-indigo-500/10 text-indigo-700",
};

const EmployeeAttendancePage = () => {
    const user = useAuthStore((state) => state.user);
    console.log("user", user)
    const { data: branch, isLoading: branchLoading, } = useBranch(user?.branches[0]);
    console.log("branch", branch);
    const isManager = user?.role === ROLES.MANAGER;
    const [activeTab, setActiveTab] = useState<"my_attendance" | "team_attendance">("my_attendance");
    const [page, setPage] = useState(1);
    const dateRange = useMemo(
        () => ({ dateFrom: daysAgoInput(29), dateTo: todayInput() }),
        []
    );

    // Fetch today's date string (YYYY-MM-DD)

    // Fetch current user's attendance records for the month
    const { data, isLoading, isFetching } = useAttendanceRecords({
        ...dateRange,
        employeeId: user?._id,
        page,
        limit: 10,
    });
    const today = todayInput();
    const todaysRecord = data?.records.find((r) => r.date === today);

    // Mutators for Punch In / Out
    const checkInMutation = useCheckIn();
    const checkOutMutation = useCheckOut();

    // Find today's specific record from current logs

    const isCheckedIn = Boolean(todaysRecord?.checkInAt && !todaysRecord?.checkOutAt);
    const isCheckedOut = Boolean(todaysRecord?.checkOutAt);

    // Geo Location Trigger Helper
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

    const getWorkingMinutes = (log: any, currentTime: number) => {
        if (!log.checkInAt) return 0;

        if (log.totalWorkingMinutes != null) {
            return log.totalWorkingMinutes;
        }

        const checkInTime = new Date(log.checkInAt).getTime();

        return Math.max(
            0,
            Math.floor((currentTime - checkInTime) / 60000)
        );
    };


    const formatWorkingTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours === 0) {
            return `${mins} mins`;
        }

        return `${hours}h ${mins}m`;
    };

    const pagination = data?.pagination;


    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Banner Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-outline-variant/30 pb-4">
                <div>
                    <p className="font-label-sm text-xs font-bold uppercase tracking-widest text-primary/80">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                    <h1 className="font-headline-md text-3xl font-bold text-on-surface mt-0.5">
                        Attendance Hub
                    </h1>
                    <p className="font-body-md text-sm text-on-surface-variant">
                        {isManager
                            ? "Track your daily punches, manage shift times, and oversee team logs."
                            : "Mark your daily punches and keep track of your monthly attendance history."}
                    </p>
                </div>

                {/* Tab Switcher (Visible to Managers Only) */}
                {isManager && (
                    <div className="flex rounded-xl bg-surface-container-low p-1 border border-outline-variant/20 shrink-0 self-start lg:self-center">
                        <button
                            type="button"
                            onClick={() => setActiveTab("my_attendance")}
                            className={`px-4 py-2 rounded-lg font-label-md text-xs font-bold transition-all ${activeTab === "my_attendance"
                                ? "bg-primary text-on-primary shadow-sm"
                                : "text-on-surface-variant hover:text-on-surface"
                                }`}
                        >
                            My Attendance
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("team_attendance")}
                            className={`px-4 py-2 rounded-lg font-label-md text-xs font-bold transition-all ${activeTab === "team_attendance"
                                ? "bg-primary text-on-primary shadow-sm"
                                : "text-on-surface-variant hover:text-on-surface"
                                }`}
                        >
                            Team Attendance
                        </button>
                    </div>
                )}
            </div>

            {/* MY ATTENDANCE TAB CONTENT */}
            {(activeTab === "my_attendance" || !isManager) && (
                <div className="space-y-6">
                    {/* Main Action Terminal & Status Card */}
                    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

                            {/* Terminal Meta Details */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isCheckedIn
                                            ? "bg-emerald-500/10 text-emerald-700"
                                            : isCheckedOut
                                                ? "bg-sky-500/10 text-sky-700"
                                                : "bg-error/10 text-error"
                                            }`}
                                    >
                                        <span
                                            className={`h-2 w-2 rounded-full ${isCheckedIn
                                                ? "bg-emerald-500 animate-pulse"
                                                : isCheckedOut
                                                    ? "bg-sky-500"
                                                    : "bg-error"
                                                }`}
                                        />
                                        {isCheckedIn
                                            ? "Clocked In & Active"
                                            : isCheckedOut
                                                ? "Shift Completed"
                                                : "Not Checked In Yet"}
                                    </span>

                                    <span className="font-label-sm text-xs font-semibold text-on-surface-variant">
                                        • Shift: {branch?.attendanceConfig?.workingHours?.startTime} - {branch?.attendanceConfig?.workingHours?.endTime}
                                    </span>
                                </div>

                                <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
                                    {isCheckedOut
                                        ? "Great work today!"
                                        : isCheckedIn
                                            ? "You are currently on duty"
                                            : "Ready to start your work day?"}
                                </h2>

                                <p className="font-body-sm text-xs text-on-surface-variant">
                                    {todaysRecord?.checkInAt
                                        ? `Checked in at ${new Date(todaysRecord.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                        : "Make sure you are within your designated branch geofence boundary to check in."}
                                </p>
                            </div>

                            {/* Conditional Action Button */}
                            <div className="w-full lg:w-auto">
                                <button
                                    type="button"
                                    disabled={
                                        checkInMutation.isPending ||
                                        checkOutMutation.isPending ||
                                        isCheckedOut
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

                        {/* Quick Metrics Banner inside Terminal */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-outline-variant/20">
                            <div>
                                <p className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                                    Check In Time
                                </p>
                                <p className="font-label-md text-sm font-bold text-on-surface mt-0.5">
                                    {todaysRecord?.checkInAt
                                        ? new Date(todaysRecord.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : "--:--"}
                                </p>
                            </div>

                            <div>
                                <p className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                                    Check Out Time
                                </p>
                                <p className="font-label-md text-sm font-bold text-on-surface mt-0.5">
                                    {todaysRecord?.checkOutAt
                                        ? new Date(todaysRecord.checkOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : "--:--"}
                                </p>
                            </div>

                            <div>
                                <p className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                                    Working Hours
                                </p>
                                <p className="font-label-md text-sm font-bold text-on-surface mt-0.5">
                                    {todaysRecord?.totalWorkingMinutes
                                        ? `${Math.floor(todaysRecord.totalWorkingMinutes / 60)}h ${todaysRecord.totalWorkingMinutes % 60}m`
                                        : "0h 0m"}
                                </p>
                            </div>

                            <div>
                                <p className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                                    Status
                                </p>
                                <p className="font-label-md text-sm font-bold text-emerald-600 mt-0.5 capitalize">
                                    {todaysRecord?.status || "Pending"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Logs Table */}
                    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">
                                    calendar_month
                                </span>
                                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                    Monthly Attendance Record
                                </h3>
                            </div>
                            <span className="font-label-sm text-xs font-semibold text-on-surface-variant">
                                This Month
                            </span>
                        </div>

                        {/* Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-outline-variant/20 text-on-surface-variant/70 font-bold uppercase tracking-wider text-[10px]">

                                        <th className="px-5 py-3">Date</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Mode</th>
                                        <th className="px-5 py-3">Check In</th>
                                        <th className="px-5 py-3">Check Out</th>
                                        <th className="px-5 py-3">Hours</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/20 text-on-surface font-medium">
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan={6} className="px-5 py-4">
                                                    <div className="h-4 w-full max-w-sm rounded bg-surface-container-high" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : !data || data.records.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                                                <span className="material-symbols-outlined text-3xl mb-2 text-outline block">
                                                    event_busy
                                                </span>
                                                <p className="font-bold text-sm">No records in this range</p>
                                            </td>
                                        </tr>
                                    ) : data ? (
                                        data.records.map((log) => (
                                            <tr key={log.date} className="hover:bg-surface-container-low/50 transition-colors">
                                                <td className="py-3 px-4 font-bold">{formatDate(log.date)}</td>
                                                <td className="py-3 px-4 uppercase text-[11px] font-bold text-on-surface-variant">
                                                    {ATTENDANCE_WORK_MODE_LABELS[log.workMode]}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`inline-block rounded-full px-2.5 py-1 font-label-sm text-[10px] font-bold ${STATUS_BADGE_CLASSES[log.status]}`}
                                                    >
                                                        {ATTENDANCE_STATUS_LABELS[log.status]}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {log.checkInAt
                                                        ? formatTime(log.checkInAt)
                                                        : "-"}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {log.checkOutAt
                                                        ? formatTime(log.checkOutAt)
                                                        : "-"}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {log.lateMinutes > 0 ? (
                                                        <span className="text-error font-bold">{log.lateMinutes} mins</span>
                                                    ) : (
                                                        <span className="text-on-surface-variant/60">On Time</span>
                                                    )}
                                                </td>
                                                {/* <td className="py-3 px-4">
                                                    <td className="px-5 py-3.5 font-semibold text-on-surface">
                                                        {formatMinutes(log.totalWorkingMinutes)}
                                                    </td>
                                                </td> */}

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-6 text-center text-on-surface-variant/60">
                                                No records found for this month.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {pagination && pagination.total > 0 && (
                            <div className="flex items-center justify-between border-t border-outline-variant/30 px-5 py-3.5">
                                <p className="font-body-sm text-xs text-on-surface-variant">
                                    Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
                                    {isFetching && " · refreshing…"}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                        disabled={pagination.page <= 1}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
                                    >
                                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    </button>
                                    <button
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={pagination.page >= pagination.totalPages}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
                                    >
                                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}



            {/* TEAM ATTENDANCE TAB CONTENT (Manager View Only) */}
            {isManager && activeTab === "team_attendance" && (
                <TeamAttendanceTab />
            )}
        </div>
    );
};


export default EmployeeAttendancePage;
