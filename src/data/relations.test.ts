import { describe, expect, it } from "vitest";
import { CARD_SLOTS, RELATIONS, slotOffset } from "./relations";

describe("slotOffset", () => {
  it("가운데 카드는 0, 양옆은 가까운 쪽으로 센다", () => {
    expect(RELATIONS.map((_, index) => slotOffset(index, 0))).toEqual([
      0, 1, 2, -2, -1,
    ]);
  });

  it("마지막 카드가 가운데면 첫 카드는 바로 오른쪽에 온다", () => {
    expect(slotOffset(0, 4)).toBe(1);
    expect(slotOffset(3, 4)).toBe(-1);
  });

  it("어느 카드가 가운데여도 모든 카드에 자리가 있다", () => {
    for (const active of RELATIONS.keys()) {
      for (const index of RELATIONS.keys()) {
        expect(CARD_SLOTS[slotOffset(index, active)]).toBeDefined();
      }
    }
  });
});
