// src/features/dialer/hooks/useStringeeClient.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { loadStringeeSdk } from "@/utils/loadStringeeSdk";
import { stringeeApi } from "@/services/stringeeApi";

type ConnectionState =
    | "idle"
    | "connecting"
    | "connected"
    | "disconnected"
    | "error";

// src/features/dialer/hooks/useStringeeClient.ts
export const useStringeeClient = () => {
    const clientRef = useRef<any>(null);
    const hasConnectedRef = useRef(false);
    const [status, setStatus] = useState<ConnectionState>("idle");
    const [error, setError] = useState<string | null>(null);

    const connect = useCallback(async () => {
        if (hasConnectedRef.current) return; // <-- must be the FIRST line
        hasConnectedRef.current = true;

        setStatus("connecting");
        setError(null);
        try {
            await loadStringeeSdk();
            const StringeeClient = (window as any).StringeeClient;
            const token = await stringeeApi.getToken();

            const client = new StringeeClient();
            clientRef.current = client;

            client.on("connect", () => {
                console.log("[Stringee] CONNECT");
                // setStatus("connected");
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
                console.log("[Stringee] REQUEST NEW TOKEN");

                try {
                    stringeeApi.clearCachedToken();

                    const freshToken = await stringeeApi.getToken();

                    console.log("[Stringee] Received fresh token");

                    client.connect(freshToken);
                } catch (err) {
                    console.error("[Stringee] TOKEN REFRESH FAILED", err);

                    setStatus("error");
                    setError("Failed to refresh Stringee session");
                }
            });

            console.log("token", { token })
            client.connect(token);
        } catch (err) {
            console.log("err", { err })
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
            // Don't reset hasConnectedRef here — StrictMode's phantom unmount would
            // otherwise let the remount fire a second real connect().
        };
    }, []);

    return { clientRef, status, error, connect, disconnect };
};