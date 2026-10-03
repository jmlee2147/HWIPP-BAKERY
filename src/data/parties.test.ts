import { describe, expect, it } from "vitest";
import { focusView, OVERVIEW_SCALE, PARTIES } from "./parties";

describe("focusView", () => {
  it("기준 칸의 카드는 판을 옮기지 않아도 제자리에 있다", () => {
    const view = focusView(0, 0);
    expect(view.x).toBeCloseTo(65.23);
    expect(view.y).toBeCloseTo(751.03);
    expect(view.scale).toBe(1);
  });

  it("오른쪽 아래 칸을 보려면 판을 왼쪽 위로 옮긴다", () => {
    const view = focusView(2, 1);
    expect(view.x).toBeLessThan(65.23 - 1000);
    expect(view.y).toBeLessThan(751.03);
  });

  it("카드마다 칸이 달라, 크게 볼 때의 판 위치도 모두 다르다", () => {
    const keys = PARTIES.map((item) => {
      const view = focusView(item.col, item.row);
      return `${Math.round(view.x)},${Math.round(view.y)}`;
    });
    expect(new Set(keys).size).toBe(PARTIES.length);
  });

  it("축소해도 보고 있던 카드의 한가운데는 화면의 같은 자리에 있다", () => {
    // 판 위의 점이 화면 어디에 놓이는지 구한다.
    const onScreen = (
      view: { x: number; y: number; scale: number },
      x: number,
      y: number,
    ) => {
      const angle = (-14.18 * Math.PI) / 180;
      return {
        x: view.x + view.scale * (x * Math.cos(angle) - y * Math.sin(angle)),
        y: view.y + view.scale * (x * Math.sin(angle) + y * Math.cos(angle)),
      };
    };
    for (const item of PARTIES) {
      const centerX = item.col * 745.74 + 745.74 / 2;
      const centerY = item.row * 893.92 + 893.92 / 2;
      const near = onScreen(focusView(item.col, item.row), centerX, centerY);
      const far = onScreen(
        focusView(item.col, item.row, OVERVIEW_SCALE),
        centerX,
        centerY,
      );
      expect(far.x).toBeCloseTo(near.x);
      expect(far.y).toBeCloseTo(near.y);
    }
  });
});
