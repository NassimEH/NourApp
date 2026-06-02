import AsyncStorage from "@react-native-async-storage/async-storage";

const ACTIVITY_LOG_KEY = "@activity_logs";
const MAX_LOGS = 8;

export type ActivityLogEntry = {
  id: string;
  label: string;
  at: number;
};

export async function getRecentActivityLogs(): Promise<ActivityLogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(ACTIVITY_LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (entry): entry is ActivityLogEntry =>
          typeof entry === "object" &&
          entry !== null &&
          typeof (entry as ActivityLogEntry).id === "string" &&
          typeof (entry as ActivityLogEntry).label === "string" &&
          typeof (entry as ActivityLogEntry).at === "number"
      )
      .sort((a, b) => b.at - a.at)
      .slice(0, MAX_LOGS);
  } catch {
    return [];
  }
}

export async function addActivityLog(label: string): Promise<void> {
  try {
    const logs = await getRecentActivityLogs();
    const next: ActivityLogEntry[] = [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, label, at: Date.now() },
      ...logs,
    ].slice(0, MAX_LOGS);
    await AsyncStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(next));
  } catch {
    // No-op: best-effort logging.
  }
}
