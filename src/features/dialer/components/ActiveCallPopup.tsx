// src/features/dialer/components/ActiveCallPopup.tsx
import { useNavigate, useLocation } from "react-router";
import { useCallStore } from "@/store/call.store";

export const ActiveCallPopup = () => {
  const { callState, toNumber, durationSec, callRef, setCallState } = useCallStore();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("callState", callState)
  const isCallActive =
    callState === "calling" || callState === "ringing" || callState === "active";
  const isOnDialerPage = location.pathname.startsWith("/dialer");
 
 
  console.log("isCallActive", isCallActive, callRef)

  // Hide popup if no call is active OR user is currently on the dialer page
  if (!isCallActive || isOnDialerPage) return null;

  const handleHangup = () => {
    if (callRef) {
      callRef.hangup((res: any) => console.log("[Global Popup] Hangup res:", res));
    }
    setCallState("ended");
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-surface-variant text-on-surface px-5 py-3.5 rounded-2xl shadow-2xl border border-primary/20 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <div>
          <div className="text-xs font-bold font-mono">{toNumber}</div>
          <div className="text-[10px] text-on-surface-variant capitalize font-medium">
            {callState} • {formatDuration(durationSec)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/20">
        <button
          onClick={() => navigate("/dialer")}
          className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors cursor-pointer"
        >
          Return to Dialer
        </button>
        <button
          onClick={handleHangup}
          className="px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
        >
          Hang Up
        </button>
      </div>
    </div>
  );
};