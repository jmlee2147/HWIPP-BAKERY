import { describe, expect, it } from "vitest";
import {
  CAKE_BOARD,
  CAKE_COLORS,
  CAKE_DECORATIONS,
  CAKE_SHAPES,
  CAKE_SPOTS,
  type CakeDecoration,
  DEFAULT_CAKE,
} from "@/data/cake";
import { type CakeLayer, cakeLayers, cakeScale } from "./cake";

const box = { left: 10, top: 20, width: 30, height: 40 };

const pick = (...ids: string[]) => ids.map((id) => ({ id }));
// 겹친 순서대로의 장식 id. 바탕은 "base"로 적는다.
const ids = (layers: CakeLayer[]) =>
  layers.map((layer) => layer.key.replace(/-\d+$/, ""));
const find = (layers: CakeLayer[], id: string) =>
  layers.find((layer) => layer.key.startsWith(`${id}-`));

const DECORATIONS: CakeDecoration[] = [
  {
    id: "wrap",
    category: "ribbon",
    placement: "fixed",
    layer: "wrap",
    shapes: {
      round: { src: "/wrap-round.png", ...box },
      heart: { src: "/wrap-heart.png", ...box },
    },
  },
  {
    id: "garland",
    category: "ribbon",
    placement: "fixed",
    layer: "garland",
    shapes: {
      round: { src: "/garland.png", ...box },
      heart: { src: "/garland.png", ...box },
      square: { src: "/garland.png", ...box },
    },
  },
  {
    id: "candle",
    category: "candle",
    placement: "top",
    src: "/candle.png",
    width: 20,
    height: 200,
    anchor: "bottom",
  },
  {
    id: "flower",
    category: "flower",
    placement: "top",
    src: "/flower.png",
    width: 100,
    height: 80,
    anchor: "center",
  },
];

describe("cakeLayers", () => {
  it("모양과 색상에 맞는 바탕 그림을 판 안에 그린다", () => {
    for (const shape of CAKE_SHAPES) {
      for (const color of CAKE_COLORS) {
        const [base, ...rest] = cakeLayers({
          shape: shape.id,
          color: color.id,
          decorations: [],
        });
        expect(base.src).toBe(
          `/assets/cake-parts/base-${color.id}-${shape.id}.webp`,
        );
        expect(base.left).toBeGreaterThanOrEqual(0);
        expect(base.top).toBeGreaterThanOrEqual(0);
        expect(base.left + base.width).toBeLessThanOrEqual(CAKE_BOARD.width);
        expect(base.top + base.height).toBeLessThanOrEqual(CAKE_BOARD.height);
        expect(rest).toEqual([]);
      }
    }
  });

  it("목록에 없는 모양이나 색상은 기본 케이크의 값으로 그린다", () => {
    const [base] = cakeLayers({
      shape: "star",
      color: "rainbow",
      decorations: [],
    } as never);
    expect(base.src).toBe(
      `/assets/cake-parts/base-${DEFAULT_CAKE.color}-${DEFAULT_CAKE.shape}.webp`,
    );
  });

  it("자리가 정해진 장식은 고른 순서와 상관없이 정해진 겹침 순서로 바탕 위에 놓인다", () => {
    const layers = cakeLayers(
      { shape: "round", color: "pink", decorations: pick("wrap", "garland") },
      DECORATIONS,
    );
    expect(ids(layers)).toEqual(["base", "garland", "wrap"]);
  });

  it("같은 층의 장식을 여러 개 고르면 먼저 고른 것 하나만 그린다", () => {
    const coatings: CakeDecoration[] = ["pink", "choco"].map((id) => ({
      id,
      category: "cream",
      placement: "fixed",
      layer: "coating",
      shapes: { round: { src: `/${id}.png`, ...box } },
    }));
    const layers = cakeLayers(
      { shape: "round", color: "white", decorations: pick("choco", "pink") },
      coatings,
    );
    expect(ids(layers)).toEqual(["base", "choco"]);
  });

  it("케이크 모양에 맞는 장식 그림을 고르고, 그 모양에 없는 장식은 그리지 않는다", () => {
    const heart = cakeLayers(
      { shape: "heart", color: "pink", decorations: pick("wrap") },
      DECORATIONS,
    );
    expect(heart[1].src).toBe("/wrap-heart.png");

    const square = cakeLayers(
      { shape: "square", color: "pink", decorations: pick("wrap", "garland") },
      DECORATIONS,
    );
    expect(ids(square)).toEqual(["base", "garland"]);
  });

  it("윗면 장식은 고른 순서대로 자리를 하나씩 차지한다", () => {
    const [first, second] = CAKE_SPOTS.round;
    const layers = cakeLayers(
      { shape: "round", color: "pink", decorations: pick("candle", "flower") },
      DECORATIONS,
    );
    const candle = find(layers, "candle");
    const flower = find(layers, "flower");

    // 초는 자리 위에 서고, 꽃은 자리 가운데에 얹힌다.
    expect(candle?.left).toBe(first.x - 10);
    expect(candle?.top).toBe(first.y - 200);
    expect(flower?.left).toBe(second.x - 50);
    expect(flower?.top).toBe(second.y - 40);
  });

  it("윗면 장식은 자리가 정해진 장식보다 위에, 뒤쪽 자리의 것부터 그린다", () => {
    const layers = cakeLayers(
      {
        shape: "round",
        color: "pink",
        decorations: pick("candle", "wrap", "flower"),
      },
      DECORATIONS,
    );
    const [first, second] = CAKE_SPOTS.round;
    const top =
      first.y < second.y ? ["candle", "flower"] : ["flower", "candle"];
    expect(ids(layers)).toEqual(["base", "wrap", ...top]);
  });

  it("자리가 모자라면 남은 윗면 장식은 그리지 않는다", () => {
    const many: CakeDecoration[] = Array.from({ length: 20 }, (_, index) => ({
      id: `candle-${index}`,
      category: "candle",
      placement: "top",
      src: "/candle.png",
      width: 20,
      height: 200,
      anchor: "bottom",
    }));
    const layers = cakeLayers(
      {
        shape: "square",
        color: "pink",
        decorations: many.map((item) => ({ id: item.id })),
      },
      many,
    );
    expect(layers).toHaveLength(1 + CAKE_SPOTS.square.length);
  });

  it("위치를 준 장식은 그 자리를 가운데로 놓고, 같은 장식을 여러 번 놓을 수 있다", () => {
    const layers = cakeLayers(
      {
        shape: "round",
        color: "pink",
        decorations: [
          { id: "flower", x: 300, y: 200 },
          { id: "flower", x: 400, y: 260, scale: 0.5 },
          { id: "candle" },
        ],
      },
      DECORATIONS,
    );
    // 위치를 준 꽃이 적힌 순서대로 놓이고, 빈 자리에 놓인 초가 맨 위에 온다.
    expect(ids(layers)).toEqual(["base", "flower", "flower", "candle"]);
    expect(layers[1]).toMatchObject({ left: 250, top: 160, width: 100 });
    expect(layers[2]).toMatchObject({ left: 375, top: 240, width: 50 });
  });

  it("위치를 준 장식은 적힌 순서를 지켜, 뒤에 적힌 자리가 정해진 장식 아래에 깔린다", () => {
    const layers = cakeLayers(
      {
        shape: "round",
        color: "pink",
        decorations: [
          { id: "flower", x: 300, y: 500 },
          { id: "wrap" },
          { id: "flower", x: 320, y: 300 },
          { id: "garland" },
        ],
      },
      DECORATIONS,
    );
    // 자리가 정해진 장식끼리는 적힌 순서와 상관없이 층 순서(가랜드, 감싸는 리본)를 지킨다.
    expect(ids(layers)).toEqual([
      "base",
      "flower",
      "garland",
      "flower",
      "wrap",
    ]);
  });

  it("돌리기와 뒤집기는 그림에 그대로 전해지고, 주지 않으면 붙지 않는다", () => {
    const layers = cakeLayers(
      {
        shape: "round",
        color: "pink",
        decorations: [
          { id: "flower", x: 300, y: 200, rotate: 30, flip: true },
          { id: "flower", x: 400, y: 260 },
        ],
      },
      DECORATIONS,
    );
    expect(layers[1]).toMatchObject({ rotate: 30, flip: true });
    expect(layers[2].rotate).toBeUndefined();
    expect(layers[2].flip).toBeUndefined();
  });

  it("목록에 없는 장식 id와 위치 없이 두 번 고른 id는 버린다", () => {
    const layers = cakeLayers(
      {
        shape: "round",
        color: "pink",
        decorations: pick("unicorn", "candle", "candle"),
      },
      DECORATIONS,
    );
    expect(ids(layers)).toEqual(["base", "candle"]);
  });

  it("실제 장식 목록의 id는 겹치지 않고, 자리가 정해진 장식은 맞는 모양이 하나 이상 있다", () => {
    const ids = CAKE_DECORATIONS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of CAKE_DECORATIONS) {
      if (item.placement !== "fixed") continue;
      expect(Object.keys(item.shapes).length).toBeGreaterThan(0);
    }
  });
});

describe("cakeScale", () => {
  it("크기가 작을수록 배율이 작고, 목록에 없는 크기는 기본 크기의 배율을 쓴다", () => {
    expect(cakeScale("large")).toBeGreaterThan(cakeScale("medium"));
    expect(cakeScale("medium")).toBeGreaterThan(cakeScale("mini"));
    expect(cakeScale("giant")).toBe(cakeScale(DEFAULT_CAKE.size));
  });
});
