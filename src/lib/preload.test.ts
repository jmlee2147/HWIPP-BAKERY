import { afterEach, describe, expect, it, vi } from "vitest";
import { loadImages } from "./preload";

describe("loadImages", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("받을 그림이 없으면 바로 준비된 것으로 본다", async () => {
    await expect(loadImages([], 1000)).resolves.toBe(true);
  });

  it("그림을 제때 받지 못하면 기다리지 않고 준비되지 않았다고 알린다", async () => {
    vi.useFakeTimers();
    const loading = loadImages(["/never-loads.webp"], 1000);

    await vi.advanceTimersByTimeAsync(1000);

    await expect(loading).resolves.toBe(false);
  });
});
