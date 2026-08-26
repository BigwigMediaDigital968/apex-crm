import { useState, useRef, useCallback } from "react";

interface UseDialerProps {
  clientRef: React.MutableRefObject<any>;
}

export const useDialer = ({ clientRef }: UseDialerProps) => {
  const [callState, setCallState] = useState<string>("idle");
  const [durationSec, setDurationSec] = useState<number>(0);
  const [toNumber, setToNumber] = useState<string>("");
  const callRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    setDurationSec(0);
    timerRef.current = setInterval(() => {
      setDurationSec((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const makeCall = useCallback(
    (targetNumber: string, customData?: Record<string, any>) => {
      if (!clientRef.current) {
        console.error("[Dialer] StringeeClient is not connected");
        return;
      }

      // Format number to clean digits with country code
      const cleanNumber = targetNumber.replace(/[^\d+]/g, "");
      setToNumber(cleanNumber);
      setCallState("calling");

      const StringeeCall = (window as any).StringeeCall;
      if (!StringeeCall) {
        console.error("[Dialer] StringeeCall SDK not found");
        setCallState("failed");
        return;
      }

      // Pass Hotline Number in +E.164 format
      const call = new StringeeCall(
        clientRef.current,
        "+917971730788", // Mandatory leading '+' format
        cleanNumber,
        false,
      );

      if (customData) {
        call.customData = JSON.stringify(customData);
      }

      callRef.current = call;

      call.makeCall((res: any) => {
        console.log("[Dialer] makeCall response:", res);
        if (res?.r !== 0) {
          console.error("[Dialer] Call initiation failed:", res?.message);
          setCallState("failed");
        }
      });

      call.on("addremotestream", (stream: MediaStream) => {
        console.log("[Dialer] Remote stream received");
        const remoteAudio = document.getElementById(
          "stringee-remote-audio",
        ) as HTMLAudioElement;
        if (remoteAudio && stream) {
          remoteAudio.srcObject = stream;
          remoteAudio
            .play()
            .catch((err) => console.warn("[Audio] Play error:", err));
        }
      });

      // Local microphone stream
      call.on("addlocalstream", (stream: MediaStream) => {
        console.log("[Dialer] Local stream added");
        const localAudio = document.getElementById(
          "stringee-local-audio",
        ) as HTMLAudioElement;
        if (localAudio && stream) {
          localAudio.srcObject = stream;
        }
      });

      // Remote caller stream
      call.on("addremotestream", (stream: MediaStream) => {
        console.log("[Dialer] Remote stream received");
        const remoteAudio = document.getElementById(
          "stringee-remote-audio",
        ) as HTMLAudioElement;
        if (remoteAudio && stream) {
          remoteAudio.srcObject = stream;
          remoteAudio
            .play()
            .catch((err) => console.warn("[Audio] Play error:", err));
        }
      });

      call.on("signalingstate", (state: any) => {
        console.log("[Dialer] Signaling state:", state);
        const code = state.code;
        // 1: Ringing, 3: Connected, 5: Ended, 6: Busy
        if (code === 1) {
          setCallState("ringing");
        } else if (code === 3) {
          setCallState("active");
          startTimer();
        } else if (code === 5 || code === 6) {
          setCallState("ended");
          stopTimer();
        }
      });

      call.on("error", (err: any) => {
        console.error("[Dialer] Call error:", err);
        setCallState("failed");
        stopTimer();
      });
    },
    [clientRef],
  );

  const hangup = useCallback(() => {
    if (callRef.current) {
      callRef.current.hangup((res: any) => {
        console.log("[Dialer] Hangup response:", res);
      });
    }
    setCallState("ended");
    stopTimer();
  }, []);

  const reset = useCallback(() => {
    callRef.current = null;
    setCallState("idle");
    setDurationSec(0);
    setToNumber("");
    stopTimer();
  }, []);

  return { callState, durationSec, toNumber, makeCall, hangup, reset };
};
