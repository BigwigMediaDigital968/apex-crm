// src/features/dialer/components/Dialer.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useStringeeClient } from "../hooks/useStringeeClient";
import { useDialer } from "../hooks/useDialer";
import { useAuthStore } from "@/store/auth.store";
import { useLead } from "@/features/leads/hooks/useLeads";
import { KeypadConsole } from "./KeypadConsole";
import { LeadContextCard } from "./LeadContextCard";
import { RecentCallLogsTable } from "./RecentCallLogsTable";

const Dialer = () => {
  const user = useAuthStore((s) => s.user);
  const [searchParams] = useSearchParams();
  const paramLeadId = searchParams.get("leadId") || searchParams.get("phone");

  const { clientRef, status, error, connect, disconnect } = useStringeeClient();
  const { callState, durationSec, toNumber, makeCall, hangup, reset } =
    useDialer({ clientRef });

  const [input, setInput] = useState("");

  // Fetch lead if redirect URL contains ?leadId=...
  const { data: paramLead } = useLead(paramLeadId || "");

  // Automatically fill input keypad when redirecting from lead page
  useEffect(() => {
    if (paramLead?.phone) {
      setInput('91' + paramLead.phone);
    }
  }, [paramLead]);

  useEffect(() => {
    connect();
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isBusy =
    callState !== "idle" && callState !== "ended" && callState !== "failed";

  const handleCall = () => {
    if (!input.trim() || status !== "connected") return;
    // makeCall(input.trim(), {
    //   userId: user?._id,
    //   branchId: user?.branches?.[0],
    // });
    makeCall(input.trim(), {
      leadId: paramLead?._id || null,
      userId: user?._id,
      branchId: user?.branches?.[0],
    });
  };

  return (
    <div className="space-y-6">
      {/* <audio id="stringee-remote-audio" autoPlay /> */}
      <audio id="stringee-remote-audio" autoPlay playsInline />
      <audio id="stringee-local-audio" autoPlay playsInline muted />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
        <div>
          <h1 className="font-headline-md text-2xl font-black text-on-surface tracking-tight">
            Dialer
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            Real-time outbound voice communication powered by Stringee
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status === "connected"
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
              : status === "connecting"
                ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                : "bg-rose-500/10 text-rose-700 border-rose-500/20"
              }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${status === "connected"
                ? "bg-emerald-500 animate-pulse"
                : status === "connecting"
                  ? "bg-amber-500 animate-ping"
                  : "bg-rose-500"
                }`}
            />
            {status === "connecting" && "Connecting WebRTC…"}
            {status === "connected" && "Service Online"}
            {status === "error" && (error || "Connection Error")}
            {status === "disconnected" && "Offline"}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 xl:col-span-5">
          <KeypadConsole
            input={input}
            setInput={setInput}
            isBusy={isBusy}
            status={status}
            error={error}
            callState={callState}
            durationSec={durationSec}
            toNumber={toNumber}
            onMakeCall={handleCall}
            onHangup={hangup}
            onReset={reset}
          />
        </div>

        <div className="lg:col-span-6 xl:col-span-7">
          <LeadContextCard
            phoneNumber={input}
            onSelectLeadPhone={(phone) => setInput(phone)}
          />
        </div>
      </div>
      <div>
        <RecentCallLogsTable
          limit={10}
          onRedial={(phone) => setInput(phone)}
        />
      </div>
    </div>
  );
};

export default Dialer;