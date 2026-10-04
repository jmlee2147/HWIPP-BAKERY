import { describe, expect, it } from "vitest";
import { FLAVORS, nearestFlavor } from "./flavors";

describe("nearestFlavor", () => {
  it("목록이 카드가 걸리는 자리에 있으면 그 카드를 고른다", () => {
    for (const [index, item] of FLAVORS.entries()) {
      expect(nearestFlavor(item.listY)).toBe(index);
    }
  });

  it("두 자리 사이에서는 더 가까운 쪽 카드를 고른다", () => {
    expect(nearestFlavor(-60)).toBe(0);
    expect(nearestFlavor(-120)).toBe(1);
  });

  it("목록을 끝보다 더 끌어도 첫 카드나 마지막 카드에 머문다", () => {
    expect(nearestFlavor(300)).toBe(0);
    expect(nearestFlavor(-2000)).toBe(FLAVORS.length - 1);
  });
});
