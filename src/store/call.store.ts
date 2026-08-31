// src/store/call.store.ts
import { create } from "zustand";

export type CallState = "idle" | "calling" | "ringing" | "active" | "ended" | "failed";

interface CallStoreState {
    callState: CallState;
    durationSec: number;
    toNumber: string;
    callRef: any | null;

    setCallState: (state: CallState) => void;
    setDurationSec: (updater: number | ((prev: number) => number)) => void;
    setToNumber: (num: string) => void;
    setCallRef: (call: any) => void;
    resetCallStore: () => void;
}

export const useCallStore = create<CallStoreState>((set) => ({
    callState: "idle",
    durationSec: 0,
    toNumber: "",
    callRef: null,

    setCallState: (callState) => set({ callState }),
    setDurationSec: (updater) =>
        set((state) => ({
            durationSec: typeof updater === "function" ? updater(state.durationSec) : updater,
        })),
    setToNumber: (toNumber) => set({ toNumber }),
    setCallRef: (callRef) => set({ callRef }),

    resetCallStore: () =>
        set({
            callState: "idle",
            durationSec: 0,
            toNumber: "",
            callRef: null,
        }),
}));