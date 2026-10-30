import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CAKE_SHAPES, type CakeShapeId } from "@/data/cake";
import { CAKE_PRESETS } from "@/data/cakePresets";
import { cakeLayers } from "@/lib/cake";

// 검수에서 오케이를 받은 완성 케이크 예시는 세 모양의 모습을 저장해 두고, 이후 변경으로 바뀌지 않게 지킨다.
// 오케이를 받으면 APPROVE=cake-01,cake-02 pnpm vitest run src/data/cakePresets.approved.test.ts 로 저장한다.
// 기록은 .claude/reviews/cake-presets.md에 있다.
const FILE = join(process.cwd(), "src/data/cakePresetsApproved.json");

type Saved = Record<string, Record<CakeShapeId, unknown[]>>;

const round = (value: number) => Math.round(value * 10) / 10;

function drawn(id: string, shape: CakeShapeId) {
  const preset = CAKE_PRESETS.find((item) => item.id === id);
  if (!preset) throw new Error(`없는 예시: ${id}`);
  return cakeLayers({
    ...preset.cake,
    shape,
    layoutShape: preset.cake.layoutShape ?? preset.cake.shape,
  }).map((layer) => ({
    src: layer.src,
    left: round(layer.left),
    top: round(layer.top),
    width: round(layer.width),
    height: round(layer.height),
    rotate: layer.rotate === undefined ? undefined : round(layer.rotate),
    flip: layer.flip,
  }));
}

function shapesOf(id: string) {
  return Object.fromEntries(
    CAKE_SHAPES.map((shape) => [shape.id, drawn(id, shape.id)]),
  ) as Record<CakeShapeId, unknown[]>;
}

const saved: Saved = JSON.parse(readFileSync(FILE, "utf8"));

const approving = (process.env.APPROVE ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);
if (approving.length > 0) {
  for (const id of approving) saved[id] = shapesOf(id);
  const sorted = Object.fromEntries(
    Object.entries(saved).sort(([a], [b]) => a.localeCompare(b)),
  );
  writeFileSync(FILE, `${JSON.stringify(sorted, null, 2)}\n`);
}

describe("검수를 마친 완성 케이크 예시", () => {
  it("저장된 예시가 모두 목록에 있다", () => {
    const ids = CAKE_PRESETS.map((preset) => preset.id);
    for (const id of Object.keys(saved)) expect(ids).toContain(id);
  });

  it.each(
    Object.keys(saved),
  )("%s는 오케이를 받은 모습에서 바뀌지 않는다", (id) => {
    expect(shapesOf(id)).toEqual(saved[id]);
  });
});

// D+하트 비즈 글자는 비즈 70여 개로 그린 한 덩어리다. 모양을 바꿔도 비즈끼리의 간격과 크기가 그대로여야 글자가 깨지지 않는다.
describe("비즈 글자", () => {
  const BEAD_LETTERS = ["cake-70", "cake-93", "cake-94", "cake-99"];

  it.each(
    BEAD_LETTERS,
  )("%s는 어느 모양에서나 비즈를 통째로 옮겨 그린다", (id) => {
    const preset = CAKE_PRESETS.find((item) => item.id === id);
    if (!preset) throw new Error(`없는 예시: ${id}`);
    const layout = preset.cake.layoutShape ?? preset.cake.shape;
    const beads = (shape: CakeShapeId) =>
      cakeLayers({ ...preset.cake, shape, layoutShape: layout }).filter(
        (layer) => layer.src.includes("pearl-gray"),
      );
    const base = beads(layout);
    for (const shape of CAKE_SHAPES.map((one) => one.id)) {
      const now = beads(shape);
      expect(now).toHaveLength(base.length);
      const dx = now[0].left - base[0].left;
      const dy = now[0].top - base[0].top;
      now.forEach((bead, index) => {
        expect(bead.left - base[index].left - dx).toBeCloseTo(0, 0);
        expect(bead.top - base[index].top - dy).toBeCloseTo(0, 0);
        expect(bead.width).toBeCloseTo(base[index].width, 0);
      });
    }
  });
});
