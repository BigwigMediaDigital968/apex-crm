// src/features/dialer/pages/DialerPage.tsx
import { useEffect, useState } from "react";
import { useStringeeClient } from "../hooks/useStringeeClient";
import { useDialer } from "../hooks/useDialer";
import { useAuthStore } from "@/store/auth.store";

const formatDuration = (sec: number) => {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
};

const DialerPage = () => {
  const user = useAuthStore((s) => s.user);
  const { clientRef, status, error, connect, disconnect } = useStringeeClient();
  const { callState, durationSec, toNumber, makeCall, hangup, reset } =
    useDialer({ clientRef });

  const [input, setInput] = useState("");

  useEffect(() => {
    connect();
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isBusy = callState !== "idle" && callState !== "ended" && callState !== "failed";

  const handleCall = () => {
    if (!input.trim() || status !== "connected") return;
    makeCall(input.trim(), {
      userId: user?._id,
      branchId: user?.branches?.[0],
    });
  };

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-6 max-w-xl mx-auto">
      {/* required for remote audio playback */}
      <audio id="stringee-remote-audio" autoPlay />

      <div>
        <h1 className="font-headline-md text-2xl font-extrabold text-on-surface">
          Dialer
        </h1>
        <p className="font-body-sm text-xs text-on-surface-variant mt-1">
          {status === "connecting" && "Connecting to calling service…"}
          {status === "connected" && "Ready to call"}
          {status === "error" && (error || "Connection failed")}
          {status === "disconnected" && "Disconnected"}
        </p>
      </div>

      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm space-y-4">
        <input
          type="tel"
          placeholder="Enter number (e.g. +9198XXXXXXXX)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isBusy}
          className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary disabled:opacity-60"
        />

        {!isBusy ? (
          <button
            type="button"
            onClick={handleCall}
            disabled={status !== "connected" || !input.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-label-md text-sm font-bold text-on-primary shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            <span className="material-symbols-outlined">call</span>
            Call
          </button>
        ) : (
          <div className="space-y-3">
            <div className="text-center">
              <p className="font-label-md text-sm font-bold text-on-surface">
                {toNumber}
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant capitalize">
                {callState === "active"
                  ? formatDuration(durationSec)
                  : callState}
              </p>
            </div>
            <button
              type="button"
              onClick={hangup}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 font-label-md text-sm font-bold text-white hover:bg-rose-700 transition-all"
            >
              <span className="material-symbols-outlined">call_end</span>
              Hang up
            </button>
          </div>
        )}

        {callState === "ended" && (
          <button
            type="button"
            onClick={reset}
            className="w-full text-xs font-bold text-primary hover:underline"
          >
            New call
          </button>
        )}
      </div>
    </div>
  );
};

export default DialerPage;