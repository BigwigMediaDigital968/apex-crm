// import { useState, useRef, useCallback } from "react";

// interface UseDialerProps {
//   clientRef: React.MutableRefObject<any>;
// }

// export const useDialer = ({ clientRef }: UseDialerProps) => {
//   const [callState, setCallState] = useState<string>("idle");
//   const [durationSec, setDurationSec] = useState<number>(0);
//   const [toNumber, setToNumber] = useState<string>("");
//   const callRef = useRef<any>(null);
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const startTimer = () => {
//     setDurationSec(0);
//     timerRef.current = setInterval(() => {
//       setDurationSec((prev) => prev + 1);
//     }, 1000);
//   };

//   const stopTimer = () => {
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }
//   };

//   const cleanupAudioElements = () => {
//     const remoteAudio = document.getElementById("stringee-remote-audio") as HTMLAudioElement;
//     const localAudio = document.getElementById("stringee-local-audio") as HTMLAudioElement;
//     if (remoteAudio) remoteAudio.srcObject = null;
//     if (localAudio) localAudio.srcObject = null;
//   };

//   const makeCall = useCallback(
//     (targetNumber: string, customData?: Record<string, any>) => {
//       if (!clientRef.current) {
//         console.error("[Dialer] StringeeClient is not connected");
//         return;
//       }

//       const cleanNumber = targetNumber.replace(/[^\d+]/g, "");
//       setToNumber(cleanNumber);
//       setCallState("calling");

//       const StringeeCall = (window as any).StringeeCall;
//       if (!StringeeCall) {
//         console.error("[Dialer] StringeeCall SDK not found");
//         setCallState("failed");
//         return;
//       }

//       const call = new StringeeCall(
//         clientRef.current,
//         "+917971730788",
//         cleanNumber,
//         false
//       );

//       if (customData) {
//         call.customData = JSON.stringify(customData);
//       }

//       callRef.current = call;

//       call.makeCall((res: any) => {
//         console.log("[Dialer] makeCall response:", res);
//         if (res?.r !== 0) {
//           console.error("[Dialer] Call initiation failed:", res?.message);
//           setCallState("failed");
//         }
//       });

//       // 1. Local microphone stream event
//       call.on("addlocalstream", (stream: MediaStream) => {
//         console.log("[Dialer] Local stream added");
//         const localAudio = document.getElementById("stringee-local-audio") as HTMLAudioElement;
//         if (localAudio && stream) {
//           localAudio.srcObject = stream;
//         }
//       });

//       // 2. Remote audio stream event
//       call.on("addremotestream", (stream: MediaStream) => {
//         console.log("[Dialer] Remote stream received");
//         const remoteAudio = document.getElementById("stringee-remote-audio") as HTMLAudioElement;
//         if (remoteAudio && stream) {
//           remoteAudio.srcObject = stream;
//           remoteAudio.play().catch((err) => console.warn("[Audio] Play error:", err));
//         }
//       });

//       // 3. Signaling State Listener (Call Connection Phases)
//       call.on("signalingstate", (state: any) => {
//         console.log("[Dialer] Signaling state:", state);
//         const code = state.code;
//         // 1: Ringing, 3: Connected, 4: Busy, 5: Ended, 6: Answered elsewhere
//         if (code === 1) {
//           setCallState("ringing");
//         } else if (code === 3) {
//           setCallState("active");
//           startTimer();
//         } else if (code === 4 || code === 5 || code === 6) {
//           setCallState("ended");
//           stopTimer();
//           cleanupAudioElements();
//         }
//       });

//       // 4. Media State Listener (WebRTC Audio Packet Status)
//       call.on("mediastate", (state: any) => {
//         console.log("[Dialer] Media state:", state);
//         if (state.code === 2) {
//           console.warn("[Dialer] Media connection disconnected");
//         }
//       });

//       // 5. Info/DTMF Listener
//       call.on("info", (info: any) => {
//         console.log("[Dialer] Call Info Received:", info);
//       });

//       // 6. Error Listener
//       call.on("error", (err: any) => {
//         console.error("[Dialer] Call error:", err);
//         setCallState("failed");
//         stopTimer();
//         cleanupAudioElements();
//       });
//     },
//     [clientRef]
//   );

//   const hangup = useCallback(() => {
//     if (callRef.current) {
//       callRef.current.hangup((res: any) => {
//         console.log("[Dialer] Hangup response:", res);
//       });
//     }
//     setCallState("ended");
//     stopTimer();
//     cleanupAudioElements();
//   }, []);

//   const reset = useCallback(() => {
//     callRef.current = null;
//     setCallState("idle");
//     setDurationSec(0);
//     setToNumber("");
//     stopTimer();
//     cleanupAudioElements();
//   }, []);

//   return { callState, durationSec, toNumber, makeCall, hangup, reset };
// };

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
    stopTimer();
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

  const cleanupAudioElements = () => {
    const remoteAudio = document.getElementById("stringee-remote-audio") as HTMLAudioElement;
    const localAudio = document.getElementById("stringee-local-audio") as HTMLAudioElement;
    if (remoteAudio) remoteAudio.srcObject = null;
    if (localAudio) localAudio.srcObject = null;
  };

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

      // Attach custom payload cleanly for Stringee Answer URL webhook
      if (customData) {
        call.customData = typeof customData === "object" ? JSON.stringify(customData) : customData;
      }

      callRef.current = call;

      // Event handlers setup prior to invoking call execution
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

      call.on("signalingstate", (state: any) => {
        const code = state.code;
        // 1: Ringing, 3: Connected, 4: Busy, 5: Ended, 6: Answered elsewhere
        if (code === 1) {
          setCallState("ringing");
        } else if (code === 3) {
          setCallState("active");
          startTimer();
        } else if (code === 4 || code === 5 || code === 6) {
          setCallState("ended");
          stopTimer();
          cleanupAudioElements();
        }
      });

      call.on("mediastate", (state: any) => {
        if (state.code === 2) {
          console.warn("[Dialer] Media connection disconnected");
        }
      });

      call.on("error", (err: any) => {
        console.error("[Dialer] Call error:", err);
        setCallState("failed");
        stopTimer();
        cleanupAudioElements();
      });

      // Execute Call Request
      call.makeCall((res: any) => {
        if (res?.r !== 0) {
          console.error("[Dialer] Call initiation failed:", res?.message);
          setCallState("failed");
          stopTimer();
          cleanupAudioElements();
        }
      });
    },
    [clientRef]
  );

  const hangup = useCallback(() => {
    if (callRef.current) {
      callRef.current.hangup((res: any) => {
        console.log("[Dialer] Hangup response:", res);
      });
    }
    setCallState("ended");
    stopTimer();
    cleanupAudioElements();
  }, []);

  const reset = useCallback(() => {
    callRef.current = null;
    setCallState("idle");
    setDurationSec(0);
    setToNumber("");
    stopTimer();
    cleanupAudioElements();
  }, []);

  return { callState, durationSec, toNumber, makeCall, hangup, reset };
};