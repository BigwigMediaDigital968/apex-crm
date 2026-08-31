// src/features/dialer/components/KeypadConsole.tsx
import React, { useState } from "react";
import { useCallStore } from "@/store/call.store";

interface KeypadConsoleProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isBusy: boolean;
  status: string;
  error: string | null;
  callState: string;
  durationSec: number;
  toNumber: string;
  onMakeCall: () => void;
  onHangup: () => void;
  onReset: () => void;
}

const KEYPAD_KEYS = [
  { digit: "1", sub: "" },
  { digit: "2", sub: "ABC" },
  { digit: "3", sub: "DEF" },
  { digit: "4", sub: "GHI" },
  { digit: "5", sub: "JKL" },
  { digit: "6", sub: "MNO" },
  { digit: "7", sub: "PQRS" },
  { digit: "8", sub: "TUV" },
  { digit: "9", sub: "WXYZ" },
  { digit: "*", sub: "" },
  { digit: "0", sub: "+" },
  { digit: "#", sub: "" },
];

const formatDuration = (sec: number) => {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
};

export const KeypadConsole: React.FC<KeypadConsoleProps> = ({
  input,
  setInput,
  isBusy,
  status,
  callState,
  durationSec,
  toNumber,
  onMakeCall,
  onHangup,
  onReset,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const callRef = useCallStore((s) => s.callRef);

  const handleKeyPress = (digit: string) => {
    if (isBusy) return;
    setInput((prev) => prev + digit);
  };

  const handleBackspace = () => {
    if (isBusy) return;
    setInput((prev) => prev.slice(0, -1));
  };

  const handleToggleMute = () => {
    if (!callRef) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    // Call Stringee SDK mute method
    callRef.mute(nextMute);
  };

  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm space-y-6">
      {/* Active Call HUD / Input Field */}
      <div className="rounded-xl bg-surface-container-low border border-outline-variant/20 p-4 min-h-[100px] flex flex-col justify-center items-center relative overflow-hidden">
        {!isBusy ? (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <input
                type="tel"
                placeholder="Enter phone number..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isBusy}
                className="w-full bg-transparent text-center font-headline-md text-2xl font-bold tracking-wider text-on-surface outline-none placeholder:text-on-surface-variant/40 placeholder:text-lg"
              />
              {input && (
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-all"
                >
                  <span className="material-symbols-outlined text-xl">
                    backspace
                  </span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-1.5 py-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary animate-pulse">
              {callState === "active" ? "Call In Progress" : callState}
            </span>
            <p className="font-headline-sm text-2xl font-black text-on-surface tracking-wider">
              {toNumber}
            </p>
            <p className="font-mono text-sm font-semibold text-primary">
              {callState === "active"
                ? formatDuration(durationSec)
                : "Connecting..."}
            </p>
          </div>
        )}
      </div>

      {/* Touch Dial Keypad */}
      {!isBusy && (
        <div className="grid grid-cols-3 gap-3">
          {KEYPAD_KEYS.map((k) => (
            <button
              key={k.digit}
              type="button"
              onClick={() => handleKeyPress(k.digit)}
              className="flex flex-col items-center justify-center py-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high active:scale-95 border border-outline-variant/20 transition-all group"
            >
              <span className="font-headline-sm text-xl font-bold text-on-surface group-hover:text-primary">
                {k.digit}
              </span>
              <span className="font-label-sm text-[9px] font-semibold text-on-surface-variant/60 tracking-widest h-3">
                {k.sub}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {!isBusy ? (
          <button
            type="button"
            onClick={onMakeCall}
            disabled={status !== "connected" || !input.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-label-md text-sm font-bold text-on-primary shadow-md hover:bg-primary/90 disabled:opacity-40 transition-all"
          >
            <span className="material-symbols-outlined text-xl">call</span>
            Start Call
          </button>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleToggleMute}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  isMuted
                    ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
                    : "bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {isMuted ? "mic_off" : "mic"}
                </span>
                {isMuted ? "Muted" : "Mute"}
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/30 hover:bg-surface-container-high text-xs font-bold transition-all"
              >
                <span className="material-symbols-outlined text-lg">
                  volume_up
                </span>
                Speaker
              </button>
            </div>

            <button
              type="button"
              onClick={onHangup}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3.5 font-label-md text-sm font-bold text-white hover:bg-rose-700 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-xl">
                call_end
              </span>
              End Call
            </button>
          </div>
        )}

        {callState === "ended" && (
          <button
            type="button"
            onClick={onReset}
            className="w-full py-2.5 rounded-xl bg-surface-container-low text-xs font-bold text-primary hover:bg-surface-container-high transition-all"
          >
            + Start Another Call
          </button>
        )}
      </div>
    </div>
  );
};