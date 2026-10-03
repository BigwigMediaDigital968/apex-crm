import { useMemo, useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/types/auth";
import type { Contest, ContestParticipant } from "@/types/contest";
import {
    useContestParticipantsQuery,
    useRemoveContestParticipant,
} from "../hooks/useContests";

// Rendered in batches so a contest with hundreds of entrants stays light.
const PAGE_SIZE = 20;
// Below this the list is short enough that search is just noise.
const SEARCH_THRESHOLD = 8;

interface ContestParticipantsProps {
    contest: Contest;
}

/** Who has tapped "I'm in". Head can remove someone (they can't rejoin). */
export const ContestParticipants = ({ contest }: ContestParticipantsProps) => {
    const { hasPermission } = usePermissions();
    const canView = hasPermission(PERMISSIONS.CONTEST_PARTICIPANT_VIEW);
    const canRemove = hasPermission(PERMISSIONS.CONTEST_UPDATE);

    const { data: participants, isLoading } = useContestParticipantsQuery(
        contest._id,
        canView
    );
    const removeParticipant = useRemoveContestParticipant();
    const [toRemove, setToRemove] = useState<ContestParticipant | null>(null);
    const [search, setSearch] = useState("");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const total = participants?.length ?? 0;
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!participants || !term) return participants ?? [];
        return participants.filter(
            (p) =>
                p.user.name.toLowerCase().includes(term) ||
                p.user.email?.toLowerCase().includes(term) ||
                p.branch?.name?.toLowerCase().includes(term)
        );
    }, [participants, search]);
    const visible = filtered.slice(0, visibleCount);
    const remaining = filtered.length - visible.length;

    if (!canView) return null;

    return (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Participants
                </h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary tabular-nums">
                    {participants ? total : contest.participantCount ?? 0}
                </span>
            </div>

            {total > SEARCH_THRESHOLD && (
                <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-base text-on-surface-variant/60">
                        search
                    </span>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setVisibleCount(PAGE_SIZE);
                        }}
                        placeholder="Search name or branch"
                        aria-label="Search participants"
                        className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low py-2 pl-8 pr-3 text-xs text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            )}

            {isLoading ? (
                <div className="space-y-2 animate-pulse">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-10 rounded-xl bg-surface-container-high" />
                    ))}
                </div>
            ) : total === 0 ? (
                <p className="text-xs text-on-surface-variant">
                    Nobody has joined yet.
                </p>
            ) : filtered.length === 0 ? (
                <p className="py-2 text-center text-xs text-on-surface-variant">
                    No participants match "{search.trim()}".
                </p>
            ) : (
                <>
                    <ul className="max-h-96 space-y-1.5 overflow-y-auto overscroll-contain pr-1">
                        {visible.map((p) => (
                            <li
                                key={p._id}
                                className="group flex items-center gap-2.5 rounded-xl bg-surface-container-low/60 px-3 py-2"
                            >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                                    {p.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-bold text-on-surface">
                                        {p.user.name}
                                    </p>
                                    <p className="truncate text-[10px] text-on-surface-variant">
                                        {p.branch?.name} · joined{" "}
                                        {new Date(p.joinedAt).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                        })}
                                    </p>
                                </div>
                                {canRemove && (
                                    <button
                                        type="button"
                                        onClick={() => setToRemove(p)}
                                        title={`Remove ${p.user.name}`}
                                        className="rounded-lg p-1 text-on-surface-variant/60 opacity-100 transition-all hover:bg-error/10 hover:text-error sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
                                    >
                                        <span className="material-symbols-outlined text-base">
                                            person_remove
                                        </span>
                                    </button>
                                )}
                            </li>
                        ))}
                        {remaining > 0 && (
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                                    className="w-full rounded-xl border border-dashed border-outline-variant/50 py-2 text-[11px] font-bold text-primary hover:bg-primary/5 transition-colors"
                                >
                                    Show {Math.min(remaining, PAGE_SIZE)} more
                                    <span className="font-normal text-on-surface-variant"> · {remaining} left</span>
                                </button>
                            </li>
                        )}
                    </ul>
                    {search.trim() && (
                        <p className="text-[11px] text-on-surface-variant">
                            {filtered.length} of {total} match
                        </p>
                    )}
                </>
            )}

            <ConfirmDialog
                open={toRemove !== null}
                onClose={() => setToRemove(null)}
                onConfirm={() =>
                    toRemove &&
                    removeParticipant.mutate(
                        { id: contest._id, userId: toRemove.user._id },
                        { onSuccess: () => setToRemove(null) }
                    )
                }
                title="Remove participant?"
                description={`${toRemove?.user.name ?? "This employee"} will be taken off the leaderboard and won't be able to join this contest again.`}
                confirmLabel="Remove"
                tone="danger"
                isLoading={removeParticipant.isPending}
            />
        </div>
    );
};

export default ContestParticipants;
