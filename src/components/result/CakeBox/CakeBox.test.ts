import { describe, expect, it } from "vitest";
import { boxCakeScale } from "@/components/result/CakeBox/CakeBox";
import { CAKE_BOARD, CAKE_SIZES } from "@/data/cake";
import { CAKE_PRESETS } from "@/data/cakePresets";
import { BOX_CAKE, BOX_CAKE_AREA, BOX_CAKE_SIZES } from "@/data/result";
import { cakeExtent } from "@/lib/cake";

// 상자 그림 위에서 케이크 그림이 차지하는 범위.
const inBox = (cake: Parameters<typeof boxCakeScale>[0]) => {
  const extent = cakeExtent(cake);
  const scale = boxCakeScale(cake);
  const centerX = CAKE_BOARD.width / 2;
  return {
    left: BOX_CAKE.centerX + (extent.left - centerX) * scale,
    right: BOX_CAKE.centerX + (extent.left + extent.width - centerX) * scale,
    top: BOX_CAKE.bottom + (extent.top - CAKE_BOARD.height) * scale,
    bottom:
      BOX_CAKE.bottom +
      (extent.top + extent.height - CAKE_BOARD.height) * scale,
  };
};

describe("상자에 담은 케이크", () => {
  it("예시 케이크는 줄이지 않고 그대로 담는다", () => {
    for (const preset of CAKE_PRESETS) {
      for (const size of CAKE_SIZES) {
        const cake = { ...preset.cake, size: size.id };
        expect(boxCakeScale(cake)).toBeCloseTo(
          BOX_CAKE.scale * BOX_CAKE_SIZES[size.id],
        );
      }
    }
  });

  it("장식을 멀리 옮겨도 상자 안쪽을 넘지 않는다", () => {
    const cake = {
      ...CAKE_PRESETS[0].cake,
      decorations: [
        ...CAKE_PRESETS[0].cake.decorations,
        { id: "candle-pink", x: -200, y: -150, scale: 3, manual: true },
      ],
    };
    const box = inBox(cake);

    expect(boxCakeScale(cake)).toBeLessThan(BOX_CAKE.scale);
    expect(box.left).toBeGreaterThanOrEqual(BOX_CAKE_AREA.left - 0.01);
    expect(box.right).toBeLessThanOrEqual(BOX_CAKE_AREA.right + 0.01);
    expect(box.top).toBeGreaterThanOrEqual(BOX_CAKE_AREA.top - 0.01);
    expect(box.bottom).toBeLessThanOrEqual(BOX_CAKE_AREA.bottom + 0.01);
  });
});
