import {
  getCompletedLessonIds,
  isLessonUnlocked,
  markLessonCompleted,
} from "../lib/learn/progress";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const storage = jest.requireMock("@react-native-async-storage/async-storage");

const lessons = [{ id: "a" }, { id: "b" }, { id: "c" }];

describe("learn progress", () => {
  const courseId = "prophets-life";

  beforeEach(() => {
    jest.clearAllMocks();
    storage.getItem.mockResolvedValue(null);
    storage.setItem.mockResolvedValue(undefined);
  });

  it("unlocks first lesson only when none completed", () => {
    expect(isLessonUnlocked(0, lessons, [])).toBe(true);
    expect(isLessonUnlocked(1, lessons, [])).toBe(false);
  });

  it("unlocks next lesson after previous completed", () => {
    expect(isLessonUnlocked(1, lessons, ["a"])).toBe(true);
    expect(isLessonUnlocked(2, lessons, ["a"])).toBe(false);
  });

  it("marks lesson completed once", async () => {
    storage.getItem.mockResolvedValue(JSON.stringify(["a"]));
    await markLessonCompleted(courseId, "b");
    expect(storage.setItem).toHaveBeenCalledWith(
      `@learn_completed_${courseId}`,
      JSON.stringify(["a", "b"])
    );
  });

  it("returns empty list when storage empty", async () => {
    const ids = await getCompletedLessonIds(courseId);
    expect(ids).toEqual([]);
  });
});
