/** @jest-environment node */

import { persistLastListen } from "../lib/quran/persistLastListen";

jest.mock("../lib/quran/storage", () => ({
  setLastListen: jest.fn(),
}));

const { setLastListen } = jest.requireMock("../lib/quran/storage");

describe("persistLastListen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("persists immediately when forced", () => {
    persistLastListen(2, 0.5, true);
    expect(setLastListen).toHaveBeenCalledWith({
      suraNumber: 2,
      progress: 0.5,
      timestamp: expect.any(Number),
    });
  });

  it("throttles repeated calls", () => {
    persistLastListen(1, 0.1, true);
    setLastListen.mockClear();
    persistLastListen(1, 0.2, false);
    expect(setLastListen).not.toHaveBeenCalled();
    jest.advanceTimersByTime(11_000);
    persistLastListen(1, 0.3, false);
    expect(setLastListen).toHaveBeenCalled();
  });
});
