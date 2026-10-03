import type { BranchRef } from "./branch";

export interface ContestMedia {
    url: string;
    publicId: string;
    resourceType: "image" | "video" | "raw";
    format?: string;
    originalName?: string;
}

export interface ContestCreatorRef {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export interface Contest {
    _id: string;
    title: string;
    description: string;
    branches: BranchRef[] | string[];
    media?: ContestMedia;
    startDate: string;
    endDate: string;
    /** Last moment to join/withdraw; falls back to endDate when unset. */
    joinDeadline?: string | null;
    participantCount?: number;
    isActive: boolean;
    createdBy: ContestCreatorRef | string;
    createdAt: string;
    updatedAt: string;
    /** Present on /contest/my-branch and /contest/:id. */
    hasJoined?: boolean;
}

/** Joining closes at joinDeadline, or when the contest ends. */
export const getJoinDeadline = (contest: Pick<Contest, "joinDeadline" | "endDate">) =>
    new Date(contest.joinDeadline || contest.endDate);

export const isJoinOpen = (contest: Contest, now = new Date()) =>
    contest.isActive && now <= getJoinDeadline(contest);

export interface ContestParticipant {
    _id: string;
    contest: string;
    user: { _id: string; name: string; email: string };
    branch: { _id: string; name: string; branchCode?: string };
    joinedAt: string;
    status: "joined" | "withdrawn" | "removed";
}

export interface ContestLeaderboardRow {
    rank: number;
    employeeId: string;
    name: string;
    branchName: string;
    verified: number;
    pending: number;
    entries: number;
}

export interface ContestListQuery {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    branchId?: string;
}

export interface ContestListData {
    contests: Contest[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreateContestPayload {
    title: string;
    description: string;
    branches: string[];
    startDate: string; // ISO datetime
    endDate: string; // ISO datetime
    /** ISO datetime; null clears it (joining stays open until endDate). */
    joinDeadline?: string | null;
    media?: File | null;
}

export type UpdateContestPayload = Partial<CreateContestPayload>;