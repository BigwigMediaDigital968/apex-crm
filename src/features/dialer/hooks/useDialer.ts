// src/features/dialer/hooks/useDialer.ts
import { useCallback, useRef, useState } from "react";
import type { DialerCallState } from "@/types/dialer";

interface UseDialerParams {
  clientRef: React.MutableRefObject<any>;
}

// Stringee signaling state codes: 0 CALLING, 1 RINGING, 2 ANSWERED, 3 BUSY, 4 ENDED
const SIGNAL = { CALLING: 0, RINGING: 1, ANSWERED: 2, BUSY: 3, ENDED: 4 };

export const useDialer = ({ clientRef }: UseDialerParams) => {
  const callRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [callState, setCallState] = useState<DialerCallState>("idle");
  const [durationSec, setDurationSec] = useState(0);
  const [toNumber, setToNumber] = useState<string | null>(null);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };
  const startTimer = () => {
    setDurationSec(0);
    timerRef.current = setInterval(() => setDurationSec((d) => d + 1), 1000);
  };

  /** metadata is passed through to /dialer/events webhook as custom_data,
   *  which the backend uses to attach the call to leadId/userId/branchId. */
  const makeCall = useCallback(
    (number: string, metadata: { leadId?: string; userId?: string; branchId?: string }) => {
      const StringeeCall = (window as any).StringeeCall;
      const client = clientRef.current;
      if (!client || !StringeeCall) return;

      const call = new StringeeCall(client, "", number, false);
      callRef.current = call;
      setToNumber(number);
      setCallState("calling");

      call.on("signalingstate", (state: any) => {
        switch (state.code) {
          case SIGNAL.RINGING:
            setCallState("ringing");
            break;
          case SIGNAL.ANSWERED:
            setCallState("active");
            startTimer();
            break;
          case SIGNAL.BUSY:
          case SIGNAL.ENDED:
            setCallState("ended");
            stopTimer();
            break;
        }
      });

      call.on("addremotestream", (stream: MediaStream) => {
        const audioEl = document.getElementById(
          "stringee-remote-audio"
        ) as HTMLAudioElement | null;
        if (audioEl) audioEl.srcObject = stream;
      });

      call.makeCall(
        (res: any) => {
          if (res?.r !== 0) setCallState("failed");
        },
        { custom_data: JSON.stringify(metadata) }
      );
    },
    [clientRef]
  );

  const hangup = useCallback(() => {
    callRef.current?.hangup?.(() => {});
    stopTimer();
    setCallState("ended");
  }, []);

  const reset = useCallback(() => {
    callRef.current = null;
    setCallState("idle");
    setDurationSec(0);
    setToNumber(null);
  }, []);

  return { callState, durationSec, toNumber, makeCall, hangup, reset };
};