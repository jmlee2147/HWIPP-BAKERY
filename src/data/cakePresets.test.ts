import { describe, expect, it } from "vitest";
import { cakeLayers } from "@/lib/cake";
import { CAKE_BOARD, CAKE_DECORATIONS } from "./cake";
import { CAKE_PRESETS } from "./cakePresets";

describe("CAKE_PRESETS", () => {
  it("id가 겹치지 않는다", () => {
    const ids = CAKE_PRESETS.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("장식 목록에 있는 장식만 쓰고, 자리가 정해진 장식은 케이크 모양에 맞는 그림이 있다", () => {
    for (const { id, cake } of CAKE_PRESETS) {
      for (const item of cake.decorations) {
        const decoration = CAKE_DECORATIONS.find(
          (candidate) => candidate.id === item.id,
        );
        expect(decoration, `${id}: ${item.id}`).toBeDefined();
        if (decoration?.placement === "fixed") {
          expect(
            decoration.shapes[cake.shape],
            `${id}: ${item.id}`,
          ).toBeDefined();
        }
      }
    }
  });

  it("모든 장식이 그려지고, 가운데가 케이크 판 근처를 벗어나지 않는다", () => {
    // 줄기처럼 케이크 밖으로 뻗는 장식이 있어 판보다 조금 넓게 본다.
    const margin = 120;
    for (const { id, cake } of CAKE_PRESETS) {
      const layers = cakeLayers(cake);
      expect(layers, id).toHaveLength(cake.decorations.length + 1);
      for (const layer of layers) {
        const x = layer.left + layer.width / 2;
        const y = layer.top + layer.height / 2;
        expect(x, `${id}: ${layer.key}`).toBeGreaterThan(-margin);
        expect(x, `${id}: ${layer.key}`).toBeLessThan(
          CAKE_BOARD.width + margin,
        );
        expect(y, `${id}: ${layer.key}`).toBeGreaterThan(-margin);
        expect(y, `${id}: ${layer.key}`).toBeLessThan(
          CAKE_BOARD.height + margin,
        );
      }
    }
  });
});
