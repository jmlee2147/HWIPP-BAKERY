import { describe, expect, it } from "vitest";
import {
  CAKE_BOARD,
  CAKE_COLORS,
  CAKE_DECORATIONS,
  CAKE_SHAPES,
  CAKE_SPOTS,
  CAKE_TOPS,
  type CakeConfig,
  type CakeDecoration,
  DEFAULT_CAKE,
} from "@/data/cake";
import { CAKE_PRESETS } from "@/data/cakePresets";
import {
  adjustDecoration,
  type CakeLayer,
  cakeLayers,
  cakeScale,
  lineFloor,
  lineLoop,
  lineRim,
  lostInShape,
  moveToShape,
  placeDecoration,
  removeDecoration,
  resizeForShape,
  shrinkForWall,
} from "./cake";

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

describe("cakeLayers: 모양을 바꾼 케이크", () => {
  const LETTERING: CakeDecoration = {
    id: "words",
    category: "lettering",
    placement: "fixed",
    layer: "lettering",
    shapes: {
      round: {
        src: "/words-round.png",
        left: 230,
        top: 324,
        width: 200,
        height: 100,
      },
    },
  };
  const center = (layer: CakeLayer) => ({
    x: layer.left + layer.width / 2,
    y: layer.top + layer.height / 2,
  });

  it("장식의 위치를 잡은 모양과 지금 모양이 같으면 좌표를 그대로 쓴다", () => {
    const decorations = [{ id: "flower", x: 500, y: 300 }];
    const plain = cakeLayers(
      { shape: "round", color: "pink", decorations },
      DECORATIONS,
    );
    const marked = cakeLayers(
      { shape: "round", layoutShape: "round", color: "pink", decorations },
      DECORATIONS,
    );
    expect(marked).toEqual(plain);
    expect(center(find(plain, "flower") as CakeLayer)).toEqual({
      x: 500,
      y: 300,
    });
  });

  it("윗면 가운데의 장식은 새 모양의 윗면 가운데로, 테두리의 장식은 새 모양의 테두리로 옮긴다", () => {
    const round = CAKE_TOPS.round;
    const rim = round.outline[0];
    const layers = cakeLayers(
      {
        shape: "square",
        layoutShape: "round",
        color: "pink",
        decorations: [
          { id: "flower", x: round.center.x, y: round.center.y },
          { id: "flower", x: rim.x, y: rim.y },
        ],
      },
      DECORATIONS,
    );
    const [, atCenter, atRim] = layers;
    expect(center(atCenter)).toEqual(CAKE_TOPS.square.center);
    // 원의 오른쪽 끝에 있던 장식은 가운데와의 좌우 관계를 지킨 채 네모 윗면 안에 놓인다.
    const moved = center(atRim);
    expect(moved.x).toBeGreaterThan(CAKE_TOPS.square.center.x);
    expect(moved.x).toBeLessThan(rim.x);
  });

  // 선 위에서 주어진 x의 y.
  const yOn = (line: { x: number; y: number }[], x: number) => {
    const index = Math.max(
      1,
      line.findIndex((point) => point.x >= x),
    );
    const from = line[index - 1];
    const to = line[index];
    return from.y + ((x - from.x) / (to.x - from.x)) * (to.y - from.y);
  };

  it("옆면에 놓인 같은 장식끼리는 모양을 바꿔도 겹치지 않는다", () => {
    // 네모의 오른쪽 면에 위아래로 놓인 꽃 두 개와 앞면의 꽃 하나.
    const layers = cakeLayers(
      {
        shape: "round",
        layoutShape: "square",
        color: "pink",
        decorations: [
          { id: "flower", x: 250, y: 620 },
          { id: "flower", x: 560, y: 560 },
          { id: "flower", x: 610, y: 470 },
        ],
      },
      DECORATIONS,
    );
    const spots = layers.slice(1).map(center);
    // 놓을 자리가 없는 것은 그리지 않을 수 있지만, 그린 것끼리는 겹치지 않는다.
    expect(spots.length).toBeGreaterThanOrEqual(2);
    spots.forEach((one, index) => {
      for (const other of spots.slice(index + 1)) {
        expect(
          Math.max(Math.abs(one.x - other.x), Math.abs(one.y - other.y)),
        ).toBeGreaterThanOrEqual(89);
      }
      expect(one.x).toBeLessThan(CAKE_BOARD.width);
    });
  });

  it("옆면 가운데의 장식은 새 모양에서도 테두리와 바닥의 가운데에 놓인다", () => {
    const round = CAKE_TOPS.round;
    const square = CAKE_TOPS.square;
    // 원의 앞쪽 가운데, 테두리와 바닥의 한가운데.
    const rim = round.outline[9];
    const floor = yOn(round.floor, rim.x);
    const moved = moveToShape(
      { x: rim.x, y: (rim.y + floor) / 2 },
      "round",
      "square",
    );
    const [, corner, leftEnd] = square.outline;
    const squareRim =
      leftEnd.y +
      ((moved.x - leftEnd.x) / (corner.x - leftEnd.x)) * (corner.y - leftEnd.y);
    // 바닥을 따라 간 길이의 한가운데라, 네모에서는 앞면의 오른쪽에 온다.
    expect(moved.x).toBeGreaterThan(300);
    expect(moved.x).toBeLessThan(corner.x);
    expect(moved.y).toBeCloseTo((squareRim + yOn(square.floor, moved.x)) / 2);
  });

  // 하트의 바닥 위에, 가장 앞으로 나온 자리의 양쪽으로 40씩 떨어뜨려 놓은 점들.
  const heartFloor = CAKE_TOPS.heart.floor;
  const chain = [-120, -80, -40, 0, 40, 80].map((step) => {
    const front = heartFloor.reduce((best, point) =>
      point.y > best.y ? point : best,
    );
    const x = front.x + step;
    return { x, y: yOn(heartFloor, x) };
  });
  const gaps = (points: { x: number; y: number }[]) =>
    points
      .slice(1)
      .map((point, index) =>
        Math.hypot(point.x - points[index].x, point.y - points[index].y),
      );

  it("바닥을 따라 두른 장식은 새 모양의 바닥 전체를, 원래 간격으로 다시 두른다", () => {
    for (const to of ["round", "square"] as const) {
      const floor = CAKE_TOPS[to].floor;
      const line = lineFloor(chain, "heart", to);
      const [leftEnd, rightEnd] = [floor[1], floor[floor.length - 2]];
      // 바닥의 처음부터 끝까지 채우고, 옆면을 타고 올라가지 않는다.
      expect(line[0].x).toBeCloseTo(leftEnd.x, 0);
      expect(line[line.length - 1].x).toBeCloseTo(rightEnd.x, 0);
      for (const point of line) {
        expect(Math.abs(point.y - yOn(floor, point.x))).toBeLessThan(4);
      }
      // 여섯 개였던 줄이 긴 바닥에서는 더 많아지고, 간격은 원래(40)와 비슷하다.
      expect(line.length).toBeGreaterThan(chain.length);
      for (const gap of gaps(line)) expect(Math.abs(gap - 40)).toBeLessThan(10);
    }
  });

  it("같은 장식이 바닥을 따라 줄지어 있을 때만 바닥을 두른 장식으로 본다", () => {
    const place = (points: { x: number; y: number }[]) =>
      cakeLayers(
        {
          shape: "square",
          layoutShape: "heart",
          color: "pink",
          decorations: points.map((point) => ({ id: "flower", ...point })),
        },
        DECORATIONS,
      )
        .slice(1)
        .map(center);
    // 여섯 개가 줄지어 있으면 네모의 바닥 전체를 두른다.
    expect(place(chain)).toHaveLength(
      lineFloor(chain, "heart", "square", shrinkForWall("heart", "square"))
        .length,
    );
    // 옆면이 낮은 모양으로 갈 때만 줄인다.
    expect(shrinkForWall("heart", "square")).toBe(1);
    expect(shrinkForWall("square", "heart")).toBeLessThan(1);
    // 하나만 있으면 옆면의 장식으로 보고 하나만 옮긴다.
    expect(place(chain.slice(0, 1))).toHaveLength(1);
  });

  it("윗면의 테두리를 따라 두른 고리는 새 모양의 테두리 안쪽에 같은 차례로 다시 두른다", () => {
    const round = CAKE_TOPS.round;
    // 원의 테두리 안쪽을 따라 여덟 개.
    const ring = Array.from({ length: 8 }, (_, index) => {
      const angle = (index / 8) * Math.PI * 2;
      return {
        x: round.center.x + Math.cos(angle) * 282 * 0.85,
        y: round.center.y + Math.sin(angle) * 212 * 0.85,
      };
    });
    const line = lineRim(ring, "round", "square") ?? [];
    expect(line).toHaveLength(8);
    // 모두 네모 윗면 안에 있고, 서로 겹치지 않게 떨어져 있다.
    const square = CAKE_TOPS.square;
    for (const spot of line) {
      const back = moveToShape(spot, "square", "round");
      expect(
        ((back.x - round.center.x) / 282) ** 2 +
          ((back.y - round.center.y) / 212) ** 2,
      ).toBeLessThan(1);
    }
    for (const gap of gaps([...line, line[0]])) expect(gap).toBeGreaterThan(60);
    expect(square.center).toBeDefined();

    // 한 바퀴를 다 둘렀지만 간격이 고르지 않던 고리는 같은 간격으로 다시 나눈다.
    const uneven = ring.map((spot, index) => {
      const angle = ((index + (index % 2) * 0.5) / 8) * Math.PI * 2;
      return {
        x: round.center.x + Math.cos(angle) * 282 * 0.85,
        y: round.center.y + Math.sin(angle) * 212 * 0.85,
        was: spot,
      };
    });
    const evened = gaps(lineRim(uneven, "round", "round") ?? []);
    const straight = gaps(uneven);
    expect(Math.max(...evened) - Math.min(...evened)).toBeLessThan(
      Math.max(...straight) - Math.min(...straight),
    );

    // 가운데에 모여 있는 장식은 고리로 보지 않는다.
    const pile = ring.map((spot) => ({
      x: round.center.x + (spot.x - round.center.x) * 0.3,
      y: round.center.y + (spot.y - round.center.y) * 0.3,
    }));
    expect(lineRim(pile, "round", "square")).toBeUndefined();
    // 몇 개뿐이어도 고리로 보지 않는다.
    expect(lineRim(ring.slice(0, 3), "round", "square")).toBeUndefined();
  });

  it("윗면의 한쪽에 작게 두른 고리는 새 모양의 윤곽을 닮은 고리로 다시 두른다", () => {
    const round = CAKE_TOPS.round;
    // 원의 위쪽 절반에 두른 납작한 고리.
    const loop = Array.from({ length: 9 }, (_, index) => {
      const angle = (index / 9) * Math.PI * 2;
      return {
        x: round.center.x + Math.cos(angle) * 200,
        y: round.center.y - 90 + Math.sin(angle) * 100,
      };
    });
    expect(lineRim(loop, "round", "heart")).toBeUndefined();
    const line = lineLoop(loop, "round", "heart") ?? [];
    expect(line).toHaveLength(9);
    // 하트의 파인 곳(위쪽 가운데)에서는 고리도 안쪽으로 들어간다.
    const ys = (points: { x: number; y: number }[]) =>
      points.map((point) => point.y);
    const top = (points: { x: number; y: number }[]) =>
      points.filter(
        (point) =>
          point.y < (Math.min(...ys(points)) + Math.max(...ys(points))) / 2,
      );
    const xsOf = top(line)
      .map((point) => point.x)
      .sort((a, b) => a - b);
    expect(xsOf.length).toBeGreaterThan(2);
    // 한 줄로 흩어 놓은 장식은 고리로 보지 않는다.
    const row = loop.map((point, index) => ({
      x: 150 + index * 40,
      y: point.y,
    }));
    expect(lineLoop(row, "round", "heart")).toBeUndefined();
  });

  it("다른 장식 위에 얹힌 장식은 받침과 함께 옮겨, 새 모양에서도 받침 위에 있다", () => {
    // 꽃 위에 초가 서 있다. 초의 밑동이 꽃의 가운데에 닿아 있다.
    const decorations = [
      { id: "flower", x: 450, y: 300 },
      { id: "candle", x: 452, y: 200 },
    ];
    for (const to of ["heart", "square"] as const) {
      const layers = cakeLayers(
        { shape: to, layoutShape: "round", color: "pink", decorations },
        DECORATIONS,
      );
      const flower = find(layers, "flower") as CakeLayer;
      const candle = find(layers, "candle") as CakeLayer;
      expect(candle.left + candle.width / 2).toBeCloseTo(
        center(flower).x + 2,
        0,
      );
      expect(candle.top + candle.height).toBeCloseTo(center(flower).y, 0);
    }
  });

  it("큰 장식에 바짝 붙여 놓은 장식은 한 세트로 옮겨, 큰 장식과의 배치를 지킨다", () => {
    const big: CakeDecoration = {
      id: "pudding",
      category: "others",
      placement: "top",
      src: "/pudding.png",
      width: 160,
      height: 160,
      anchor: "center",
    };
    const heart = CAKE_TOPS.heart.center;
    // 푸딩의 오른쪽에 붙은 꽃과, 멀리 떨어진 꽃.
    const decorations = [
      { id: "pudding", x: heart.x, y: heart.y },
      { id: "flower", x: heart.x + 125, y: heart.y - 20 },
      { id: "flower", x: heart.x - 200, y: heart.y + 60 },
    ];
    for (const to of ["round", "square"] as const) {
      const [, pudding, near, far] = cakeLayers(
        { shape: to, layoutShape: "heart", color: "pink", decorations },
        [...DECORATIONS, big],
      ).map(center);
      expect(near.x - pudding.x).toBeCloseTo(125, 0);
      expect(near.y - pudding.y).toBeCloseTo(-20, 0);
      expect(Math.abs(far.x - pudding.x + 200)).toBeGreaterThan(0.5);
    }
  });

  it("윗면에 온전히 얹혀 있던 장식은 새 모양에서도 테두리 밖으로 걸치지 않는다", () => {
    // 원의 오른쪽 테두리 바로 안쪽에 놓인 꽃.
    const round = CAKE_TOPS.round;
    const layers = cakeLayers(
      {
        shape: "square",
        layoutShape: "round",
        color: "pink",
        decorations: [
          { id: "flower", x: round.center.x + 240, y: round.center.y },
        ],
      },
      DECORATIONS,
    );
    const flower = find(layers, "flower") as CakeLayer;
    const middle = center(flower);
    // 꽃의 오른쪽 끝 가까이가 네모 윗면의 오른쪽 변보다 안쪽에 있다.
    const [rightEnd, corner] = CAKE_TOPS.square.outline;
    const edgeX =
      rightEnd.x +
      ((middle.y - rightEnd.y) / (corner.y - rightEnd.y)) *
        (corner.x - rightEnd.x);
    expect(middle.x + flower.width * 0.35).toBeLessThanOrEqual(edgeX + 1);
  });

  it("그 모양의 그림이 없으면 낱개 장식을 윗면 안쪽을 따라 둘러 그리고, 가까이 온 장식은 그 위에 얹는다", () => {
    const ringed: CakeDecoration = {
      id: "piping",
      category: "cream",
      placement: "fixed",
      layer: "cream-piping",
      shapes: { heart: { src: "/piping-heart.png", ...box } },
      rings: { round: { part: "flower", count: 8, scale: 1, inset: 0.8 } },
    };
    const all = [...DECORATIONS, ringed];
    expect(lostInShape({ decorations: pick("piping") }, "round", all)).toEqual(
      [],
    );
    expect(lostInShape({ decorations: pick("piping") }, "square", all)).toEqual(
      ["piping"],
    );

    const heart = CAKE_TOPS.heart;
    ringed.rings = {
      ...ringed.rings,
      heart: { part: "flower", count: 8, scale: 1, inset: 0.8 },
    };
    // 하트에서 둘러 놓인 자리 가운데 하나 위에 초가 서 있다.
    const perch = {
      x: heart.center.x + (heart.outline[0].x - heart.center.x) * 0.8,
      y: heart.center.y + (heart.outline[0].y - heart.center.y) * 0.8,
    };
    const layers = cakeLayers(
      {
        shape: "round",
        layoutShape: "heart",
        color: "pink",
        decorations: [
          { id: "piping" },
          { id: "candle", x: perch.x, y: perch.y - 100 },
        ],
      },
      all,
    );
    const flowers = layers.filter((layer) => layer.src === "/flower.png");
    expect(flowers).toHaveLength(8);
    // 둘러 놓인 것은 모두 원의 윗면 안에 있고, 뒤쪽 것부터 그린다.
    flowers.forEach((flower, index) => {
      const { x, y } = center(flower);
      const round = CAKE_TOPS.round;
      expect(
        ((x - round.center.x) / 282) ** 2 + ((y - round.center.y) / 212) ** 2,
      ).toBeLessThan(1);
      if (index > 0)
        expect(y).toBeGreaterThanOrEqual(center(flowers[index - 1]).y);
    });
    // 초의 밑동이 둘러 놓인 것 가운데 하나의 한가운데에 닿는다.
    const candle = find(layers, "candle") as CakeLayer;
    const foot = {
      x: candle.left + candle.width / 2,
      y: candle.top + candle.height,
    };
    expect(
      flowers.some((flower) => {
        const { x, y } = center(flower);
        return Math.abs(x - foot.x) < 0.01 && Math.abs(y - foot.y) < 0.01;
      }),
    ).toBe(true);
  });

  it("모양별 자리를 적어 둔 장식은 계산을 거치지 않고 그 자리에, 적어 둔 배율과 겹침 순서로 그린다", () => {
    const decorations = [
      { id: "flower", x: 300, y: 300 },
      {
        id: "candle",
        x: 320,
        y: 280,
        at: { heart: { x: 400, y: 350, scale: 2, under: true } },
      },
      { id: "flower", x: 200, y: 400, at: { heart: { x: 150, y: 420 } } },
    ];
    const moved = cakeLayers(
      { shape: "heart", layoutShape: "round", color: "pink", decorations },
      DECORATIONS,
    );
    const candle = find(moved, "candle") as CakeLayer;
    expect(center(candle)).toEqual({ x: 400, y: 350 });
    expect(candle.width).toBe(40);
    // 아래에 깔도록 적은 초가 꽃들보다 먼저 그려진다.
    expect(ids(moved)).toEqual(["base", "candle", "flower", "flower"]);
    expect(center(moved[3])).toEqual({ x: 150, y: 420 });
    // 원래 모양에서는 적어 둔 자리를 쓰지 않는다.
    const original = cakeLayers(
      { shape: "round", color: "pink", decorations },
      DECORATIONS,
    );
    expect(center(find(original, "candle") as CakeLayer)).toEqual({
      x: 320,
      y: 280,
    });
    expect(ids(original)).toEqual(["base", "flower", "candle", "flower"]);
  });

  it("특정 모양에서만 그리는 장식은 다른 모양에서 그리지 않고, 윗면 묶음을 옮기는 값은 그 모양에서만 더한다", () => {
    const decorations = [
      { id: "flower", x: 330, y: 374 },
      {
        id: "flower",
        x: 330,
        y: 374,
        only: ["square" as const],
        at: { square: { x: 100, y: 300 } },
      },
    ];
    const count = (shape: "round" | "heart" | "square") =>
      cakeLayers(
        { shape, layoutShape: "round", color: "pink", decorations },
        DECORATIONS,
      ).length - 1;
    expect(count("round")).toBe(1);
    expect(count("heart")).toBe(1);
    expect(count("square")).toBe(2);

    const single = [{ id: "flower", x: 330, y: 374 }];
    const plain = cakeLayers(
      {
        shape: "heart",
        layoutShape: "round",
        color: "pink",
        decorations: single,
      },
      DECORATIONS,
    );
    const shifted = cakeLayers(
      {
        shape: "heart",
        layoutShape: "round",
        color: "pink",
        decorations: single,
        shift: { heart: { x: 10, y: 30 } },
      },
      DECORATIONS,
    );
    expect(center(shifted[1]).x - center(plain[1]).x).toBeCloseTo(10);
    expect(center(shifted[1]).y - center(plain[1]).y).toBeCloseTo(30);
  });

  it("모양을 바꿔도 장식의 크기는 그대로 둔다", () => {
    expect(resizeForShape("round", "heart")).toBe(1);
    const layers = cakeLayers(
      {
        shape: "heart",
        layoutShape: "round",
        color: "pink",
        decorations: [{ id: "flower", x: 330, y: 374 }],
      },
      DECORATIONS,
    );
    expect((find(layers, "flower") as CakeLayer).width).toBeCloseTo(100);
  });

  it("세워 두는 장식은 밑동이 닿은 자리를 기준으로 옮긴다", () => {
    // 초의 밑동이 원의 윗면 가운데에 닿아 있다.
    const { center: from } = CAKE_TOPS.round;
    const layers = cakeLayers(
      {
        shape: "heart",
        layoutShape: "round",
        color: "pink",
        decorations: [{ id: "candle", x: from.x, y: from.y - 100 }],
      },
      DECORATIONS,
    );
    const candle = find(layers, "candle") as CakeLayer;
    expect(candle.left + candle.width / 2).toBeCloseTo(
      CAKE_TOPS.heart.center.x,
    );
    expect(candle.top + candle.height).toBeCloseTo(CAKE_TOPS.heart.center.y);
  });

  it("지금 모양의 그림이 없는 글자는 다른 모양의 그림을 윗면에 맞춰 줄여 쓴다", () => {
    const layers = cakeLayers(
      {
        shape: "heart",
        layoutShape: "round",
        color: "pink",
        decorations: pick("words"),
      },
      [LETTERING],
    );
    const words = find(layers, "words") as CakeLayer;
    expect(words.src).toBe("/words-round.png");
    // 원의 윗면 가운데에 있던 글자는 하트의 윗면 가운데에 놓인다.
    expect(center(words).x).toBeCloseTo(CAKE_TOPS.heart.center.x);
    expect(center(words).y).toBeCloseTo(CAKE_TOPS.heart.center.y);
    expect(words.width).toBeLessThanOrEqual(200);
    expect(words.width / words.height).toBeCloseTo(2);
  });

  it("빌려 온 글자가 새 윗면을 벗어나면 안에 들 때까지 가운데로 당기고 줄인다", () => {
    // 하트의 윗면 오른쪽 위에 치우친 큰 글자.
    const tilted: CakeDecoration = {
      ...LETTERING,
      shapes: {
        heart: {
          src: "/words-heart.png",
          left: 300,
          top: 220,
          width: 280,
          height: 160,
        },
      },
    };
    const layers = cakeLayers(
      {
        shape: "square",
        layoutShape: "heart",
        color: "pink",
        decorations: pick("words"),
      },
      [tilted],
    );
    const words = find(layers, "words") as CakeLayer;
    const middle = center(words);
    // 그림 안쪽의 네 귀퉁이가 네모 윗면 안에 있다.
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        const corner = {
          x: middle.x + sx * words.width * 0.4,
          y: middle.y + sy * words.height * 0.4,
        };
        // 윗면 안의 점은 같은 모양으로 옮겨도, 윗면 밖으로 밀려나지 않는다.
        const back = moveToShape(corner, "square", "round");
        const round = CAKE_TOPS.round;
        expect(
          ((back.x - round.center.x) / 282) ** 2 +
            ((back.y - round.center.y) / 212) ** 2,
        ).toBeLessThanOrEqual(1.02);
      }
    }
    expect(words.width / words.height).toBeCloseTo(280 / 160);
  });

  it("케이크 모양을 따라 그린 장식은 직접 준 위치가 있어도, 모양이 바뀌면 새 그림의 정해진 자리에 놓는다", () => {
    const decorations = [{ id: "wrap", x: 400, y: 400, scale: 2 }];
    const original = cakeLayers(
      { shape: "round", color: "pink", decorations },
      DECORATIONS,
    );
    const changed = cakeLayers(
      { shape: "heart", layoutShape: "round", color: "pink", decorations },
      DECORATIONS,
    );
    expect(find(original, "wrap")).toMatchObject({
      src: "/wrap-round.png",
      left: 400 - box.width,
      width: box.width * 2,
    });
    expect(find(changed, "wrap")).toMatchObject({
      src: "/wrap-heart.png",
      ...box,
    });
  });

  it("모양을 바꾸면 그릴 수 없게 되는 장식을 알려 준다. 글자는 빌려 쓰므로 세지 않는다", () => {
    const cake = { decorations: pick("wrap", "garland", "words", "candle") };
    const all = [...DECORATIONS, LETTERING];
    expect(lostInShape(cake, "round", all)).toEqual([]);
    expect(lostInShape(cake, "heart", all)).toEqual([]);
    expect(lostInShape(cake, "square", all)).toEqual(["wrap"]);
  });

  it("케이크 모양을 따라 그린 장식은 그 모양의 그림이 없으면 그리지 않는다", () => {
    const layers = cakeLayers(
      {
        shape: "square",
        layoutShape: "round",
        color: "pink",
        decorations: pick("wrap"),
      },
      DECORATIONS,
    );
    expect(ids(layers)).toEqual(["base"]);
  });

  it("실제 윗면 테두리는 모양마다 가운데를 둘러싸고, 어느 방향으로도 테두리에 닿는다", () => {
    for (const from of CAKE_SHAPES) {
      for (const to of CAKE_SHAPES) {
        for (let degree = 0; degree < 360; degree += 15) {
          const angle = (degree / 180) * Math.PI;
          const { center: origin } = CAKE_TOPS[from.id];
          const moved = moveToShape(
            {
              x: origin.x + Math.cos(angle) * 50,
              y: origin.y + Math.sin(angle) * 50,
            },
            from.id,
            to.id,
          );
          expect(Number.isFinite(moved.x) && Number.isFinite(moved.y)).toBe(
            true,
          );
          expect(moved.x).toBeGreaterThan(0);
          expect(moved.x).toBeLessThan(CAKE_BOARD.width);
          expect(moved.y).toBeGreaterThan(0);
          expect(moved.y).toBeLessThan(CAKE_BOARD.height);
        }
      }
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

describe("placeDecoration", () => {
  const plain: CakeConfig = { ...DEFAULT_CAKE, decorations: [] };
  const centerOf = (layer: CakeLayer) => ({
    x: layer.left + layer.width / 2,
    y: layer.top + layer.height / 2,
  });
  const last = (cake: CakeConfig) => {
    const layers = cakeLayers(cake);
    return layers[layers.length - 1];
  };

  it("낱개 장식을 케이크 왼쪽의 빈 곳에 놓고, 받은 구성은 고치지 않는다", () => {
    const before = structuredClone(plain);

    const cake = placeDecoration(plain, "candle-pink");

    expect(plain).toEqual(before);
    expect(cake.decorations).toHaveLength(1);
    expect(cake.decorations[0]).toMatchObject({
      id: "candle-pink",
      manual: true,
    });
    expect(cake.layoutShape).toBe("round");
    const round = CAKE_SHAPES.find((shape) => shape.id === "round");
    const edge = (CAKE_BOARD.width - (round?.width ?? 0)) / 2;
    const layer = last(cake);
    expect(layer.src).toContain("candle-pink");
    expect(layer.left + layer.width).toBeLessThan(edge);
  });

  it("같은 장식을 여러 번 놓을 수 있다", () => {
    const cake = placeDecoration(
      placeDecoration(plain, "star-pink"),
      "star-pink",
    );

    expect(cake.decorations).toHaveLength(2);
    expect(cakeLayers(cake)).toHaveLength(3);
  });

  it("모양을 바꾼 케이크에 놓은 장식은 놓은 자리에 그려지고, 좌표는 처음 모양 기준으로 저장된다", () => {
    for (const standing of ["candle-pink", "star-pink"]) {
      const there = last(
        placeDecoration({ ...plain, shape: "heart" }, standing),
      );
      const moved: CakeConfig = {
        ...plain,
        shape: "heart",
        layoutShape: "round",
      };

      const cake = placeDecoration(moved, standing);

      expect(cake.layoutShape).toBe("round");
      expect(centerOf(last(cake)).x).toBeCloseTo(centerOf(there).x);
      expect(centerOf(last(cake)).y).toBeCloseTo(centerOf(there).y);
      // 처음 모양으로 돌아가도 케이크 왼쪽의 빈 곳에 남는다.
      const back = last({ ...cake, shape: "round" });
      expect(centerOf(back).x).toBeLessThan(CAKE_TOPS.round.center.x);
      expect(Number.isFinite(centerOf(back).y)).toBe(true);
    }
  });

  it("모양을 바꾼 예시 케이크에 장식을 더해도 원래 있던 장식은 움직이지 않는다", () => {
    for (const preset of CAKE_PRESETS.slice(0, 12)) {
      for (const shape of CAKE_SHAPES) {
        const cake: CakeConfig = {
          ...preset.cake,
          shape: shape.id,
          layoutShape: preset.cake.shape,
        };
        const before = cakeLayers(cake);

        const after = cakeLayers(placeDecoration(cake, "flower-rose"));

        expect(after.slice(0, before.length)).toEqual(before);
        expect(after).toHaveLength(before.length + 1);
      }
    }
  });

  it("케이크 모양을 따라 그린 장식은 한 번 누르면 얹고 다시 누르면 뺀다", () => {
    const worn = placeDecoration(plain, "ribbon-wrap");
    expect(ids(cakeLayers(worn))).toEqual(["base", "ribbon-wrap"]);

    expect(placeDecoration(worn, "ribbon-wrap").decorations).toEqual([]);
  });

  it("지금 모양의 그림이 없는 장식은 얹지 않는다", () => {
    const cake = { ...plain, shape: "square" as const };

    expect(placeDecoration(cake, "coating-pink")).toBe(cake);
  });

  it("예시에 처음부터 있던 장식은 빼거나 바꾸지 않는다", () => {
    const cake: CakeConfig = { ...plain, decorations: [{ id: "ribbon-wrap" }] };

    expect(placeDecoration(cake, "ribbon-wrap")).toBe(cake);
  });

  it("목록에 없는 장식은 더하지 않는다", () => {
    expect(placeDecoration(plain, "unknown")).toBe(plain);
  });
});

describe("adjustDecoration", () => {
  const plain: CakeConfig = { ...DEFAULT_CAKE, decorations: [] };
  const centerOf = (cake: CakeConfig) => {
    const layers = cakeLayers(cake);
    const layer = layers[layers.length - 1];
    return {
      x: layer.left + layer.width / 2,
      y: layer.top + layer.height / 2,
      width: layer.width,
      rotate: layer.rotate,
    };
  };

  it("옮긴 자리, 크기, 기울기를 저장하고 받은 구성은 고치지 않는다", () => {
    const cake = placeDecoration(plain, "candle-pink");
    const before = structuredClone(cake);

    const moved = adjustDecoration(cake, 0, { x: 300, y: 250 });
    const turned = adjustDecoration(moved, 0, { scale: 1.5, rotate: 30 });

    expect(cake).toEqual(before);
    expect(turned.decorations[0]).toMatchObject({
      id: "candle-pink",
      x: 300,
      y: 250,
      scale: 1.5,
      rotate: 30,
    });
    // 세워 두는 장식도 크기를 바꿀 때 그림의 가운데는 제자리에 있다.
    expect(centerOf(moved)).toMatchObject({ x: 300, y: 250 });
    expect(centerOf(turned).x).toBeCloseTo(300);
    expect(centerOf(turned).y).toBeCloseTo(250);
    expect(centerOf(turned).width).toBeCloseTo(centerOf(moved).width * 1.5);
    expect(centerOf(turned).rotate).toBe(30);
  });

  it("모양을 바꾼 케이크에서 옮기면 옮긴 자리에 그려지고, 좌표는 처음 모양 기준으로 저장된다", () => {
    for (const id of ["candle-pink", "flower-rose"]) {
      const cake = placeDecoration(
        { ...plain, shape: "square", layoutShape: "round" },
        id,
      );
      const spot = CAKE_TOPS.square.center;

      const moved = adjustDecoration(cake, 0, { ...spot, scale: 1.4 });

      expect(moved.layoutShape).toBe("round");
      expect(centerOf(moved).x).toBeCloseTo(spot.x);
      expect(centerOf(moved).y).toBeCloseTo(spot.y);
      // 윗면 가운데에 놓았으니 처음 모양으로 돌아가도 윗면 위에 있다.
      const back = centerOf({ ...moved, shape: "round" });
      expect(Math.abs(back.x - CAKE_TOPS.round.center.x)).toBeLessThan(40);
      expect(Math.abs(back.y - CAKE_TOPS.round.center.y)).toBeLessThan(120);
    }
  });

  it("다른 모양에서 옮기면 앞서 적어 둔 모양별 자리는 버린다", () => {
    const inHeart = placeDecoration(
      { ...plain, shape: "heart", layoutShape: "round" },
      "star-pink",
    );
    const inSquare = adjustDecoration({ ...inHeart, shape: "square" }, 0, {
      x: 330,
      y: 330,
    });

    expect(Object.keys(inSquare.decorations[0].at ?? {})).toEqual(["square"]);
  });

  it("예시에 처음부터 있던 장식은 고치거나 빼지 않는다", () => {
    const cake: CakeConfig = {
      ...plain,
      decorations: [{ id: "star-pink", x: 300, y: 300 }],
    };

    expect(adjustDecoration(cake, 0, { x: 10, y: 10 })).toBe(cake);
    expect(removeDecoration(cake, 0)).toBe(cake);
    expect(adjustDecoration(cake, 5, { scale: 2 })).toBe(cake);
  });
});

describe("removeDecoration", () => {
  it("직접 놓은 장식만 빼고 받은 구성은 고치지 않는다", () => {
    const cake = placeDecoration(
      placeDecoration(
        { ...DEFAULT_CAKE, decorations: [{ id: "pearl", x: 300, y: 300 }] },
        "candle-pink",
      ),
      "star-pink",
    );
    const before = structuredClone(cake);

    const removed = removeDecoration(cake, 1);

    expect(cake).toEqual(before);
    expect(removed.decorations.map((item) => item.id)).toEqual([
      "pearl",
      "star-pink",
    ]);
  });
});
