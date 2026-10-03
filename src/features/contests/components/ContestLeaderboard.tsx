import { useAuthStore } from "@/store/auth.store";
import { useContestLeaderboardQuery } from "../hooks/useContests";
import type { Contest, ContestLeaderboardRow } from "@/types/contest";

// Only the top of the table is shown; the viewer's own row is pinned below it.
const TOP_N = 10;

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

const MEDAL_CLASSES = [
    "bg-amber-400/15 text-amber-600 border-amber-400/40",
    "bg-slate-400/15 text-slate-500 border-slate-400/40",
    "bg-orange-400/15 text-orange-600 border-orange-400/40",
];

interface ContestLeaderboardProps {
    contest: Contest;
}

// Ranking happens on the backend (GET /contest/:id/leaderboard): only joined
// participants, verified revenue from startDate to endDate, pending breaks ties.
export const ContestLeaderboard = ({ contest }: ContestLeaderboardProps) => {
    const hasStarted = new Date() >= new Date(contest.startDate);
    const currentUserId = useAuthStore((s) => s.user?._id);

    const { data, isLoading, isError } = useContestLeaderboardQuery(
        contest._id,
        hasStarted
    );
    const rows = data ?? [];

    const totalVerified = rows.reduce((sum, r) => sum + r.verified, 0);
    const topAmount = rows[0]?.verified ?? 0;

    const emptyState = (icon: string, title: string, message: string) => (
        <div className="py-8 text-center space-y-2 bg-surface-container-low/40 rounded-xl border border-dashed border-outline-variant/40">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <h4 className="text-xs font-bold text-on-surface">{title}</h4>
            <p className="text-[11px] text-on-surface-variant max-w-xs mx-auto">{message}</p>
        </div>
    );

    if (!hasStarted) {
        return emptyState(
            "schedule",
            "Contest Hasn't Started",
            `Standings will appear here once the contest begins on ${new Date(
                contest.startDate
            ).toLocaleDateString(undefined, { dateStyle: "medium" })}.`
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-2 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-14 bg-surface-container-high rounded-xl" />
                ))}
            </div>
        );
    }

    if (isError) {
        return emptyState(
            "error",
            "Couldn't Load Standings",
            "Revenue data for this contest could not be loaded. Please try again later."
        );
    }

    if (rows.length === 0) {
        return emptyState(
            "military_tech",
            "No Participants Yet",
            "Standings appear here once employees tap \"I'm in\" to join this contest."
        );
    }

    const topRows = rows.slice(0, TOP_N);
    // Someone ranked below the cut still sees where they stand.
    const myRow = rows.find((r) => r.employeeId === currentUserId);
    const pinnedRow = myRow && myRow.rank > TOP_N ? myRow : null;
    const hiddenCount = rows.length - topRows.length - (pinnedRow ? 1 : 0);

    const renderRow = (row: ContestLeaderboardRow) => {
        const { rank } = row;
        const share = topAmount > 0 ? (row.verified / topAmount) * 100 : 0;
        const isMe = row.employeeId === currentUserId;

        return (
            <li
                key={row.employeeId}
                className={`flex items-center gap-3 rounded-xl border p-3 ${
                    isMe
                        ? "border-primary/50 bg-primary/10 ring-2 ring-primary/20"
                        : rank <= 3
                          ? "border-primary/20 bg-primary/5"
                          : "border-outline-variant/30 bg-surface-container-low/40"
                }`}
            >
                <div
                    className={`h-8 w-8 shrink-0 rounded-full border flex items-center justify-center font-extrabold tabular-nums ${
                        rank >= 100 ? "text-[10px]" : "text-xs"
                    } ${
                        MEDAL_CLASSES[rank - 1] ??
                        "bg-surface-container-high text-on-surface-variant border-outline-variant/30"
                    }`}
                >
                    {rank <= 3 ? (
                        <span className="material-symbols-outlined text-base">
                            {rank === 1 ? "trophy" : "military_tech"}
                        </span>
                    ) : (
                        rank
                    )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-bold text-on-surface">
                            {row.name}
                            {isMe && (
                                <span className="ml-1.5 rounded-md bg-primary px-1.5 py-0.5 align-middle text-[10px] font-bold text-on-primary">
                                    You
                                </span>
                            )}
                        </p>
                        <p className="shrink-0 text-sm font-extrabold text-on-surface">
                            {formatCurrency(row.verified)}
                        </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-on-surface-variant">
                        <span className="truncate">
                            {row.branchName} · {row.entries}{" "}
                            {row.entries === 1 ? "entry" : "entries"}
                        </span>
                        {row.pending > 0 && (
                            <span className="shrink-0 text-amber-600">
                                +{formatCurrency(row.pending)} pending
                            </span>
                        )}
                    </div>
                    <div className="h-1 w-full rounded-full bg-surface-container-high overflow-hidden">
                        <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${share}%` }}
                        />
                    </div>
                </div>
            </li>
        );
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-on-surface-variant">
                <span>
                    <span className="font-bold text-on-surface">{rows.length}</span>{" "}
                    {rows.length === 1 ? "participant" : "participants"} · Total verified{" "}
                    <span className="font-bold text-on-surface">{formatCurrency(totalVerified)}</span>
                </span>
                <span>
                    {rows.length > TOP_N ? `Top ${TOP_N} by verified revenue` : "Ranked by verified revenue"}
                </span>
            </div>

            <ol className="space-y-2">
                {topRows.map(renderRow)}

                {hiddenCount > 0 && (
                    <li
                        aria-hidden="true"
                        className="flex items-center gap-3 py-1 text-[11px] font-semibold text-on-surface-variant"
                    >
                        <span className="h-px flex-1 border-t border-dashed border-outline-variant/50" />
                        {hiddenCount} more {hiddenCount === 1 ? "participant" : "participants"}
                        <span className="h-px flex-1 border-t border-dashed border-outline-variant/50" />
                    </li>
                )}

                {pinnedRow && renderRow(pinnedRow)}
            </ol>
        </div>
    );
};

export default ContestLeaderboard;
