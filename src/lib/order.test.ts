import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatOrderDate, formatOrderNumber, nextOrderNumber } from "./order";

describe("nextOrderNumber", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("처음에는 1이고 부를 때마다 하나씩 오른다", () => {
    expect(nextOrderNumber()).toBe(1);
    expect(nextOrderNumber()).toBe(2);
    expect(nextOrderNumber()).toBe(3);
  });

  it("999 다음은 다시 1이다", () => {
    window.localStorage.setItem("hwipp-bakery:order-number", "998");

    expect(nextOrderNumber()).toBe(999);
    expect(nextOrderNumber()).toBe(1);
  });

  it("저장된 값이 숫자가 아니면 1부터 다시 센다", () => {
    window.localStorage.setItem("hwipp-bakery:order-number", "abc");

    expect(nextOrderNumber()).toBe(1);
    expect(nextOrderNumber()).toBe(2);
  });

  it("저장소를 쓸 수 없으면 1을 돌려준다", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(nextOrderNumber()).toBe(1);
    expect(nextOrderNumber()).toBe(1);
  });
});

describe("formatOrderNumber", () => {
  it("세 자리로 맞춰 괄호로 감싼다", () => {
    expect(formatOrderNumber(1)).toBe("(001)");
    expect(formatOrderNumber(42)).toBe("(042)");
    expect(formatOrderNumber(999)).toBe("(999)");
  });
});

describe("formatOrderDate", () => {
  it("연.월.일을 두 자리 월과 일로 적는다", () => {
    expect(formatOrderDate(new Date(2026, 8, 10))).toBe("2026.09.10");
    expect(formatOrderDate(new Date(2026, 11, 3))).toBe("2026.12.03");
  });
});
