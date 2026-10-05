import { describe, expect, it } from "vitest";
import { cakeLayers } from "@/lib/cake";
import { CAKE_BOARD, CAKE_DECORATIONS, CAKE_SHAPES } from "./cake";
import { CAKE_PRESETS } from "./cakePresets";
import { BLACK_DROPS, WHITE_DROPS } from "./drops";

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
      // 다른 모양에서만 그리는 장식은 원래 모양에서 그려지지 않는다.
      const drawn = cake.decorations.filter(
        (item) => !item.only || item.only.includes(cake.shape),
      );
      expect(layers, id).toHaveLength(drawn.length + 1);
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

describe("물방울이 있는 완성 케이크", () => {
  const withDrops = CAKE_PRESETS.filter(({ cake }) =>
    cake.decorations.some((item) => item.id.startsWith("drop-")),
  );
  const dropCenters = (layers: ReturnType<typeof cakeLayers>) =>
    layers
      .filter((layer) => layer.src.includes("/drop-"))
      .map((layer) => ({
        x: layer.left + layer.width / 2,
        y: layer.top + layer.height / 2,
      }));

  it("모양을 바꾸면 물방울이 그 모양의 배치 자리에 그대로 놓인다", () => {
    expect(withDrops.length).toBeGreaterThan(0);
    for (const { cake } of withDrops) {
      const white = cake.decorations.some((item) =>
        item.id.startsWith("drop-white"),
      );
      const layouts = white ? WHITE_DROPS : BLACK_DROPS;
      for (const shape of CAKE_SHAPES) {
        if (shape.id === cake.shape) continue;
        const centers = dropCenters(
          cakeLayers({ ...cake, shape: shape.id, layoutShape: cake.shape }),
        );
        expect(centers.length).toBeGreaterThan(0);
        for (const center of centers) {
          const nearest = Math.min(
            ...layouts[shape.id].map((spot) =>
              Math.hypot(spot.x - center.x, spot.y - center.y),
            ),
          );
          expect(nearest).toBeLessThan(0.01);
        }
      }
    }
  });

  it("원래 모양에서는 다른 모양용 물방울이 그려지지 않는다", () => {
    for (const { cake } of withDrops) {
      const own = cake.decorations.filter(
        (item) =>
          item.id.startsWith("drop-") && item.only?.includes(cake.shape),
      );
      expect(dropCenters(cakeLayers(cake))).toHaveLength(own.length);
    }
  });
});
