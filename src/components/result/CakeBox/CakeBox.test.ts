import { describe, expect, it } from "vitest";
import { boxCakeScale } from "@/components/result/CakeBox/CakeBox";
import { CAKE_BOARD, CAKE_SIZES } from "@/data/cake";
import { CAKE_PRESETS } from "@/data/cakePresets";
import {
  BOX_CAKE,
  BOX_CAKE_AREA,
  BOX_CAKE_SIZES,
  BOX_FLOOR,
} from "@/data/result";
import { cakeBaseBox, cakeExtent } from "@/lib/cake";

// 상자 그림 위에서 케이크 바탕의 바닥이 놓이는 좌우.
const floorEdges = (cake: Parameters<typeof boxCakeScale>[0]) => {
  const base = cakeBaseBox(cake);
  const scale = boxCakeScale(cake);
  const centerX = CAKE_BOARD.width / 2;
  return {
    left: BOX_CAKE.centerX + (base.left - centerX) * scale,
    right: BOX_CAKE.centerX + (base.left + base.width - centerX) * scale,
  };
};

// 상자 그림 위에서 케이크 그림 전체가 차지하는 위아래.
const vertical = (cake: Parameters<typeof boxCakeScale>[0]) => {
  const extent = cakeExtent(cake);
  const scale = boxCakeScale(cake);
  return {
    top: BOX_CAKE.bottom + (extent.top - CAKE_BOARD.height) * scale,
    bottom:
      BOX_CAKE.bottom +
      (extent.top + extent.height - CAKE_BOARD.height) * scale,
  };
};

describe("상자에 담은 케이크", () => {
  it("예시 케이크의 바탕이 바닥면 밖으로 나가지 않는다", () => {
    for (const preset of CAKE_PRESETS) {
      for (const size of CAKE_SIZES) {
        const cake = { ...preset.cake, size: size.id };
        const edges = floorEdges(cake);

        expect(edges.left).toBeGreaterThanOrEqual(BOX_FLOOR.left - 0.01);
        expect(edges.right).toBeLessThanOrEqual(BOX_FLOOR.right + 0.01);
      }
    }
  });

  it("예시 케이크가 상자 위아래를 넘지 않는다", () => {
    for (const preset of CAKE_PRESETS) {
      for (const size of CAKE_SIZES) {
        const cake = { ...preset.cake, size: size.id };
        const box = vertical(cake);

        expect(box.top).toBeGreaterThanOrEqual(BOX_CAKE_AREA.top - 0.01);
        expect(box.bottom).toBeLessThanOrEqual(BOX_CAKE_AREA.bottom + 0.01);
      }
    }
  });

  it("바닥면에 들어가는 케이크는 줄이지 않는다", () => {
    // 원형 예시는 바탕이 좁아 그대로 들어간다.
    const round = CAKE_PRESETS.find((preset) => preset.cake.shape === "round");
    if (!round) throw new Error("원형 예시가 없다");

    expect(boxCakeScale(round.cake)).toBeCloseTo(
      BOX_CAKE.scale * BOX_CAKE_SIZES[round.cake.size],
    );
  });

  it("장식을 멀리 옮겨도 상자 위아래를 넘지 않는다", () => {
    const cake = {
      ...CAKE_PRESETS[0].cake,
      decorations: [
        ...CAKE_PRESETS[0].cake.decorations,
        { id: "candle-pink", x: -200, y: -150, scale: 3, manual: true },
      ],
    };

    expect(boxCakeScale(cake)).toBeLessThan(BOX_CAKE.scale);
    expect(vertical(cake).top).toBeGreaterThanOrEqual(BOX_CAKE_AREA.top - 0.01);
  });
});
