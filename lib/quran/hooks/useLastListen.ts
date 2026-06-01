import { useCallback, useState } from "react";
import { getLastListen, setLastListen } from "../storage";
import type { LastListen } from "../types";

export function useLastListen(): {
  lastListen: LastListen | null;
  refresh: () => Promise<void>;
  saveListen: (suraNumber: number, progress: number) => Promise<void>;
} {
  const [lastListen, setLastListenState] = useState<LastListen | null>(null);

  const refresh = useCallback(async () => {
    const value = await getLastListen();
    setLastListenState(value);
  }, []);

  const saveListen = useCallback(async (suraNumber: number, progress: number) => {
    const value: LastListen = {
      suraNumber,
      progress: Math.min(1, Math.max(0, progress)),
      timestamp: Date.now(),
    };
    await setLastListen(value);
    setLastListenState(value);
  }, []);

  return { lastListen, refresh, saveListen };
}
