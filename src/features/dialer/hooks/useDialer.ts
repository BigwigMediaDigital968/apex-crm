// src/features/dialer/hooks/useDialer.ts
import { useRef, useCallback, useEffect } from "react";
import { useCallStore } from "@/store/call.store";

interface UseDialerProps {
  clientRef: React.MutableRefObject<any>;
}

export const useDialer = ({ clientRef }: UseDialerProps) => {
  const {
    callState,
    durationSec,
    toNumber,
    callRef: storeCallRef,
    setCallState,
    setDurationSec,
    setToNumber,
    setCallRef,
    resetCallStore,
  } = useCallStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setDurationSec(0);
    timerRef.current = setInterval(() => {
      setDurationSec((prev) => prev + 1);
    }, 1000);
  }, [setDurationSec, stopTimer]);

  const cleanupAudioElements = () => {
    try {
      const remoteAudio = document.getElementById("stringee-remote-audio") as HTMLAudioElement;
      const localAudio = document.getElementById("stringee-local-audio") as HTMLAudioElement;
      if (remoteAudio) {
        remoteAudio.pause();
        remoteAudio.srcObject = null;
      }
      if (localAudio) {
        localAudio.pause();
        localAudio.srcObject = null;
      }
    } catch (e) {
      console.warn("[Dialer] Audio cleanup error:", e);
    }
  };

  // Keep duration timer active during page routes
  useEffect(() => {
    if (callState === "active" && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setDurationSec((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [callState, setDurationSec]);

  const makeCall = useCallback(
    (targetNumber: string, customData?: Record<string, any>) => {
      if (!clientRef.current) {
        console.error("[Dialer] StringeeClient is not connected");
        return;
      }

      const cleanNumber = targetNumber.replace(/[^\d+]/g, "");
      setToNumber(cleanNumber);
      setCallState("calling");

      const StringeeCall = (window as any).StringeeCall;
      if (!StringeeCall) {
        console.error("[Dialer] StringeeCall SDK not found");
        setCallState("failed");
        return;
      }

      const call = new StringeeCall(
        clientRef.current,
        "+917971730788",
        cleanNumber,
        false
      );

      if (customData) {
        call.customData = typeof customData === "object" ? JSON.stringify(customData) : customData;
      }

      setCallRef(call);

      // --- WebRTC Media Event Handlers ---
      call.on("addlocalstream", (stream: MediaStream) => {
        const localAudio = document.getElementById("stringee-local-audio") as HTMLAudioElement;
        if (localAudio && stream) {
          localAudio.srcObject = stream;
        }
      });

      call.on("addremotestream", (stream: MediaStream) => {
        const remoteAudio = document.getElementById("stringee-remote-audio") as HTMLAudioElement;
        if (remoteAudio && stream) {
          remoteAudio.srcObject = stream;
          remoteAudio.play().catch((err) => console.warn("[Audio] Autoplay error:", err));
        }
      });

      // --- Signaling state listener (Handles remote user hanging up) ---
      call.on("signalingstate", (state: any) => {
        console.log("[Dialer] Signaling state changed:", state);
        const code = state.code;

        // 1: Ringing, 3: Connected/Answered, 4: Busy, 5: Ended/Cut by Remote, 6: Answered Elsewhere
        if (code === 1) {
          setCallState("ringing");
        } else if (code === 3) {
          setCallState("active");
          startTimer();
        } else if (code === 4 || code === 5 || code === 6) {
          console.log("[Dialer] Call terminated by signaling state:", code);
          setCallState("ended");
          stopTimer();
          cleanupAudioElements();
        }
      });

      call.on("mediastate", (state: any) => {
        console.log("[Dialer] Media state changed:", state);
        if (state.code === 2) {
          console.warn("[Dialer] Media connection disconnected");
        }
        setCallState("ended");
        stopTimer();
        cleanupAudioElements();
      });

      call.on("error", (err: any) => {
        console.error("[Dialer] Call error:", err);
        setCallState("failed");
        stopTimer();
        cleanupAudioElements();
      });

      // Execute Call
      call.makeCall((res: any) => {
        if (res?.r !== 0) {
          console.error("[Dialer] Call initiation failed:", res?.message);
          setCallState("failed");
          stopTimer();
          cleanupAudioElements();
        }
      });
    },
    [clientRef, setCallState, setToNumber, setCallRef, startTimer, stopTimer]
  );

  // Safe hangup function
  const hangup = useCallback(() => {
    if (storeCallRef) {
      try {
        storeCallRef.hangup((res: any) => {
          console.log("[Dialer] Hangup response:", res);
        });
      } catch (err) {
        console.warn("[Dialer] Safe hangup exception caught:", err);
      }
    }
    setCallState("ended");
    stopTimer();
    cleanupAudioElements();
  }, [storeCallRef, setCallState, stopTimer]);

  const reset = useCallback(() => {
    resetCallStore();
    stopTimer();
    cleanupAudioElements();
  }, [resetCallStore, stopTimer]);

  return { callState, durationSec, toNumber, makeCall, hangup, reset };
};