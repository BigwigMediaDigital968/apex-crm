import { useCallback, useEffect, useRef, useState } from "react";
import { loadStringeeSdk } from "@/utils/loadStringeeSdk";
import { stringeeApi } from "@/services/stringeeApi";

type ConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

// ✅ 1. Add India Region WebSocket Server Addresses from Stringee Dashboard
const STRINGEE_SERVER_ADDRS = [
  "wss://india-s1.stringee.com:32082/",
  "wss://india-s2.stringee.com:32082/",
  "wss://india-s3.stringee.com:32082/",
];

export const useStringeeClient = () => {
  const clientRef = useRef<any>(null);
  const hasConnectedRef = useRef(false);
  const [status, setStatus] = useState<ConnectionState>("idle");
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (hasConnectedRef.current) return;
    hasConnectedRef.current = true;

    setStatus("connecting");
    setError(null);
    try {
      await loadStringeeSdk();
      const StringeeClient = (window as any).StringeeClient;
      const token = await stringeeApi.getToken();

      // ✅ 2. Pass STRINGEE_SERVER_ADDRS here
      const client = new StringeeClient(STRINGEE_SERVER_ADDRS);
      clientRef.current = client;

      client.on("connect", () => {
        console.log("[Stringee] CONNECT");
        setStatus("connected");
      });

      client.on("disconnect", (res: any) => {
        console.log("[Stringee] DISCONNECT", res);
        setStatus("disconnected");
      });

      client.on("authen", (res: any) => {
        console.log("[Stringee] AUTHEN", res);

        if (res?.r !== 0) {
          console.error("[Stringee] AUTH FAILED", {
            code: res?.r,
            message: res?.message,
            response: res,
          });

          setError(res?.message ?? "Stringee authentication failed");
          setStatus("error");
          hasConnectedRef.current = false;
          stringeeApi.clearCachedToken();
        }
      });

      client.on("requestnewtoken", async () => {
        try {
          stringeeApi.clearCachedToken();
          const freshToken = await stringeeApi.getToken();
          client.connect(freshToken);
        } catch (err) {
          setStatus("error");
          setError("Failed to refresh Stringee session");
        }
      });

      client.connect(token);
    } catch (err) {
      hasConnectedRef.current = false;
      setError(err instanceof Error ? err.message : "Failed to connect to Stringee");
      setStatus("error");
    }
  }, []);

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect?.();
    clientRef.current = null;
    hasConnectedRef.current = false;
    setStatus("idle");
  }, []);

  useEffect(() => {
    return () => {
      clientRef.current?.disconnect?.();
    };
  }, []);

  return { clientRef, status, error, connect, disconnect };
};