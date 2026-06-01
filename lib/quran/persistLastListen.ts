import { setLastListen } from "./storage";

let lastPersistAt = 0;
const THROTTLE_MS = 10_000;

/** Enregistre la dernière écoute (avec throttle sauf si force). */
export function persistLastListen(
  suraNumber: number,
  progress: number,
  force = false
): void {
  const now = Date.now();
  if (!force && now - lastPersistAt < THROTTLE_MS) return;
  lastPersistAt = now;
  void setLastListen({
    suraNumber,
    progress: Math.min(1, Math.max(0, progress)),
    timestamp: now,
  });
}
