import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_AMOUNT = "@sadaqa_monthly_goal";
const KEY_DONE = "@sadaqa_month_done";

function monthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

export async function getSadaqaMonthlyGoal(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEY_AMOUNT);
    const n = raw ? parseFloat(raw) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export async function setSadaqaMonthlyGoal(amount: number): Promise<void> {
  await AsyncStorage.setItem(KEY_AMOUNT, String(Math.max(0, amount)));
}

export async function getSadaqaMonthDone(): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem(KEY_DONE);
    if (!stored) return 0;
    const parsed = JSON.parse(stored) as { month: string; amount: number };
    if (parsed.month !== monthKey()) return 0;
    return Number.isFinite(parsed.amount) ? parsed.amount : 0;
  } catch {
    return 0;
  }
}

export async function setSadaqaMonthDone(amount: number): Promise<void> {
  await AsyncStorage.setItem(
    KEY_DONE,
    JSON.stringify({ month: monthKey(), amount: Math.max(0, amount) })
  );
}
