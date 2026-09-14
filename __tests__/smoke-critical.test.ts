/**
 * Smoke tests — parcours critiques (logique pure, sans UI).
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getCompletedLessonIds,
  markLessonCompleted,
} from "@/lib/learn/progress";
import { getLearnStreakInfo, recordLearnActivityDay } from "@/lib/learn/streak";
import { filterSurasByQuery } from "@/lib/quran/searchSuras";

jest.mock("@react-native-async-storage/async-storage", () => {
  let store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (k: string) => store[k] ?? null),
      setItem: jest.fn(async (k: string, v: string) => {
        store[k] = v;
      }),
      removeItem: jest.fn(async (k: string) => {
        delete store[k];
      }),
      clear: jest.fn(async () => {
        store = {};
      }),
    },
  };
});

jest.mock("@/lib/supabase/user-data", () => ({
  getAuthenticatedUserId: jest.fn(async () => null),
  upsertLessonCompletion: jest.fn(async () => undefined),
}));

describe("smoke: learn progress + streak", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("marks a lesson completed and records streak activity", async () => {
    await markLessonCompleted("prophets", "lesson-1");
    const ids = await getCompletedLessonIds("prophets");
    expect(ids).toContain("lesson-1");

    await recordLearnActivityDay(new Date("2026-09-14T12:00:00"));
    const streak = await getLearnStreakInfo(new Date("2026-09-14T12:00:00"));
    expect(streak.streak).toBeGreaterThanOrEqual(1);
    expect(streak.weekDays.some(Boolean)).toBe(true);
  });
});

describe("smoke: sura search filter", () => {
  const sample = [
    {
      number: 1,
      name: "الفاتحة",
      englishName: "Al-Faatiha",
      englishNameTranslation: "The Opening",
      numberOfAyahs: 7,
      revelationType: "Meccan" as const,
    },
    {
      number: 2,
      name: "البقرة",
      englishName: "Al-Baqara",
      englishNameTranslation: "The Cow",
      numberOfAyahs: 286,
      revelationType: "Medinan" as const,
    },
  ];

  it("filters by number and name", () => {
    expect(filterSurasByQuery(sample, "1")).toHaveLength(1);
    expect(filterSurasByQuery(sample, "baqara")[0]?.number).toBe(2);
    expect(filterSurasByQuery(sample, "")).toHaveLength(0);
  });
});
