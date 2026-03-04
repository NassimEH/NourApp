import { useState, useEffect, useCallback } from "react";
import { getLastRead, setLastRead } from "../storage";
import type { LastRead } from "../types";

export function useLastRead(): {
  lastRead: LastRead | null;
  setLastReadState: (suraNumber: number, scrollOffsetY: number) => Promise<void>;
  clear: () => Promise<void>;
} {
  const [lastRead, setLastReadState] = useState<LastRead | null>(null);

  useEffect(() => {
    getLastRead().then(setLastReadState);
  }, []);

  const setLastReadStateCallback = useCallback(async (suraNumber: number, scrollOffsetY: number) => {
    const value: LastRead = { suraNumber, scrollOffsetY, timestamp: Date.now() };
    await setLastRead(value);
    setLastReadState(value);
  }, []);

  const clear = useCallback(async () => {
    await setLastRead({ suraNumber: 1, scrollOffsetY: 0, timestamp: 0 });
    setLastReadState(null);
  }, []);

  return {
    lastRead,
    setLastReadState: setLastReadStateCallback,
    clear,
  };
}
