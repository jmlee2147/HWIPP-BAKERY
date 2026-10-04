import { describe, expect, it } from "vitest";
import { loadingPercent } from "./loading";

describe("loadingPercent", () => {
  it("0%에서 시작해 정해 둔 시간이 지나면 100%가 된다", () => {
    expect(loadingPercent(0, 8000)).toBe(0);
    expect(loadingPercent(8000, 8000)).toBe(100);
    expect(loadingPercent(20000, 8000)).toBe(100);
  });

  it("끝나기 전에는 100%에 닿지 않고, 뒤로 가지 않는다", () => {
    let previous = 0;
    for (let elapsed = 0; elapsed < 8000; elapsed += 100) {
      const percent = loadingPercent(elapsed, 8000);
      expect(percent).toBeGreaterThanOrEqual(previous);
      expect(percent).toBeLessThan(100);
      previous = percent;
    }
  });

  it("시간이 잘못 주어져도 범위를 벗어나지 않는다", () => {
    expect(loadingPercent(-500, 8000)).toBe(0);
    expect(loadingPercent(100, 0)).toBe(100);
  });
});
