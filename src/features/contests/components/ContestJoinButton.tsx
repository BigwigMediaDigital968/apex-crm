import { useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/types/auth";
import { getJoinDeadline, isJoinOpen, type Contest } from "@/types/contest";
import { useJoinContest, useWithdrawFromContest } from "../hooks/useContests";

const formatDeadline = (date: Date) =>
    date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

interface ContestJoinButtonProps {
    contest: Contest;
    /** Stretch to the container width (cards, popups). */
    fullWidth?: boolean;
}

/**
 * "I'm in" opt-in for employees. Renders nothing for roles without
 * contest:join, so it can be dropped into shared views.
 */
export const ContestJoinButton = ({ contest, fullWidth = false }: ContestJoinButtonProps) => {
    const { hasPermission } = usePermissions();
    const join = useJoinContest();
    const withdraw = useWithdrawFromContest();
    const [confirmWithdraw, setConfirmWithdraw] = useState(false);

    if (!hasPermission(PERMISSIONS.CONTEST_JOIN)) return null;

    const open = isJoinOpen(contest);
    const deadline = formatDeadline(getJoinDeadline(contest));
    const width = fullWidth ? "w-full" : "";

    if (contest.hasJoined) {
        return (
            <div className={`space-y-1.5 ${width}`}>
                <div
                    className={`flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-700 ${width}`}
                >
                    <span className="material-symbols-outlined text-base">verified</span>
                    You're in
                </div>
                {open && (
                    <button
                        type="button"
                        onClick={() => setConfirmWithdraw(true)}
                        className={`block text-center text-[11px] font-semibold text-on-surface-variant hover:text-error hover:underline transition-colors ${width}`}
                    >
                        Withdraw
                    </button>
                )}
                <ConfirmDialog
                    open={confirmWithdraw}
                    onClose={() => setConfirmWithdraw(false)}
                    onConfirm={() =>
                        withdraw.mutate(contest._id, {
                            onSuccess: () => setConfirmWithdraw(false),
                        })
                    }
                    title="Withdraw from contest?"
                    description={`You'll be taken off the leaderboard for "${contest.title}". You can join again until ${deadline}.`}
                    confirmLabel="Withdraw"
                    tone="danger"
                    isLoading={withdraw.isPending}
                />
            </div>
        );
    }

    if (!open) {
        return (
            <div
                className={`flex items-center justify-center gap-1.5 rounded-xl border border-outline-variant/30 bg-surface-container-high px-4 py-2.5 text-xs font-bold text-on-surface-variant ${width}`}
            >
                <span className="material-symbols-outlined text-base">lock</span>
                Joining closed
            </div>
        );
    }

    return (
        <div className={`space-y-1.5 ${width}`}>
            <button
                type="button"
                onClick={() => join.mutate(contest._id)}
                disabled={join.isPending}
                className={`group relative flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary shadow-md ring-4 ring-primary/15 transition-all hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-lg active:translate-y-0 disabled:opacity-60 ${width}`}
            >
                <span
                    className={`material-symbols-outlined text-lg ${
                        join.isPending ? "animate-spin" : "group-hover:motion-safe:animate-nudge"
                    }`}
                >
                    {join.isPending ? "progress_activity" : "back_hand"}
                </span>
                {join.isPending ? "Joining…" : "I'm in"}
            </button>
            <p className="text-center text-[11px] text-on-surface-variant">
                Join by <span className="font-semibold text-on-surface">{deadline}</span>
            </p>
        </div>
    );
};

export default ContestJoinButton;
