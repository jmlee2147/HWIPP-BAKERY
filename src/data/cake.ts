export const CAKE_SIZES = [
  { id: "large", label: "SIZE 1 - 15cm", scale: 1 },
  { id: "medium", label: "SIZE 2 - 12cm", scale: 0.8 },
  { id: "mini", label: "SIZE 3 - mini", scale: 0.6 },
] as const;

// width와 height는 가장 큰 크기일 때 바탕 그림이 그려지는 크기다.
// 그림마다 여백이 달라 중앙이 어긋나면 offsetX, offsetY로 보정한다.
export const CAKE_SHAPES = [
  {
    id: "round",
    label: "CIRCLE",
    width: 572,
    height: 602,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: "heart",
    label: "HEART",
    width: 500,
    height: 543,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: "square",
    label: "SQUARE",
    width: 646,
    height: 598,
    offsetX: 0,
    offsetY: 0,
  },
] as const;

export const CAKE_COLORS = [
  { id: "white", label: "WHITE" },
  { id: "pink", label: "PINK" },
  { id: "black", label: "BLACK" },
  { id: "yellow", label: "YELLOW" },
  { id: "sky", label: "SKYBLUE" },
  { id: "choco", label: "CHOCO" },
] as const;

export type CakeSizeId = (typeof CAKE_SIZES)[number]["id"];
export type CakeShapeId = (typeof CAKE_SHAPES)[number]["id"];
export type CakeColorId = (typeof CAKE_COLORS)[number]["id"];

// 케이크에 얹은 장식 하나. 위치가 없으면 그 장식의 정해진 자리나 윗면의 빈 자리에 놓는다.
export interface CakeDecorationItem {
  id: string;
  // 판 위에서 장식 그림의 가운데 좌표. x와 y를 함께 준다.
  x?: number;
  y?: number;
  // 기본 크기에 대한 배율. 없으면 1이다.
  scale?: number;
  // 그림 가운데를 축으로 시계 방향으로 돌린 각도.
  rotate?: number;
  // true면 위아래로 뒤집는다.
  flip?: boolean;
  // 적어 두면 그 모양들에서만 그린다. 원래 모양에는 없지만 다른 모양에서 빈 자리를 메우려고 더하는 장식에 쓴다.
  only?: CakeShapeId[];
  // 케이크를 다른 모양으로 바꿨을 때 놓을 자리. 계산으로 옮긴 자리가 어색한 장식에만 직접 적는다.
  // under가 true면 그 모양에서는 다른 윗면 장식들보다 아래에 깔아 그리고, over가 true면 위에 얹어 그린다.
  // scale을 적으면 그 모양에서는 그 배율로, rotate를 적으면 그 각도로 그린다.
  at?: Partial<
    Record<
      CakeShapeId,
      {
        x: number;
        y: number;
        under?: boolean;
        over?: boolean;
        scale?: number;
        rotate?: number;
      }
    >
  >;
  // 관람객이 수정 화면에서 직접 놓은 장식. 예시의 배치와 한 묶음으로 옮기지 않고, 다른 장식들 위에 따로 그린다.
  manual?: boolean;
  // 한꺼번에 놓은 묶음(물방울)의 이름. 같은 이름의 장식은 수정 화면에서 함께 옮기고 함께 지운다.
  group?: string;
}

export interface CakeConfig {
  size: CakeSizeId;
  shape: CakeShapeId;
  color: CakeColorId;
  // 얹을 장식. 목록에 없는 id는 그릴 때 버린다.
  decorations: CakeDecorationItem[];
  // 장식의 위치를 잡을 때 기준으로 삼은 모양. 없으면 shape와 같다.
  // 모양을 바꿔도 장식의 좌표는 그대로 두고, 그릴 때 이 모양에서 지금 모양으로 옮긴다.
  layoutShape?: CakeShapeId;
  // 케이크를 다른 모양으로 바꿨을 때 윗면의 장식 전체를 더 옮길 거리. 계산으로 옮긴 자리가 한쪽으로 치우칠 때만 적는다.
  shift?: Partial<Record<CakeShapeId, { x: number; y: number }>>;
}

export const DEFAULT_CAKE: CakeConfig = {
  size: "large",
  shape: "round",
  color: "white",
  decorations: [],
};

// 케이크 한 개를 그리는 판의 크기. 부품의 위치는 모두 이 판의 왼쪽 위를 기준으로 한다.
// 초처럼 케이크 위로 솟는 장식이 잘리지 않도록 위쪽에 headroom만큼 빈 자리를 두고, 바탕은 그 아래 영역의 가운데에 놓는다.
export const CAKE_BOARD = { width: 660, height: 770, headroom: 150 };

export interface CakeBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type CakeDecorationCategory =
  | "cream"
  | "fruit"
  | "candle"
  | "flower"
  | "ribbon"
  | "lettering"
  | "others";

// 자리가 정해진 장식이 겹치는 순서. 뒤에 있을수록 위에 놓인다. 같은 층에서는 먼저 고른 것 하나만 그린다.
// 프로스팅과 코팅은 둘 다 케이크 겉면을 통째로 덮어서, 같은 층(frosting)에 두고 하나만 얹는다.
export const CAKE_LAYERS = [
  "frosting",
  "cream-top",
  "cream-border",
  "cream-piping",
  "sprinkle",
  "garland",
  "lettering",
  "wrap",
] as const;

export type CakeLayerId = (typeof CAKE_LAYERS)[number];

// 케이크 겉면을 덮는 층. 다른 장식은 모두 이 위에 놓인다.
export const SURFACE_LAYERS: CakeLayerId[] = ["frosting", "cream-top"];

// 겉면 바로 위, 다른 장식들보다 아래에 까는 장식. 자리가 정해진 장식은 층으로, 낱개 장식(물방울)은 id로 적는다.
// 아래에서 위로 스프링클, 물방울, 감싸는 리본 순서다. 리본은 물방울 위로 지나간다.
export const UNDERLAY_LAYERS = {
  belowParts: "sprinkle",
  aboveParts: "wrap",
} as const;
export const UNDERLAY_PARTS = [
  "drop-black-oval",
  "drop-black-round",
  "drop-white-oval",
  "drop-white-round",
];

// 윗면의 빈 자리에 차례로 놓는 부품. bottom은 자리 위에 세우고(초), center는 자리 가운데에 얹는다(꽃, 매듭).
interface TopDecoration {
  id: string;
  category: CakeDecorationCategory;
  placement: "top";
  src: string;
  width: number;
  height: number;
  anchor: "bottom" | "center";
}

// 케이크 모양에 맞춰 그려져 자리가 정해진 부품. 모양에 맞는 그림이 없으면 그 모양에서는 그리지 않는다.
interface FixedDecoration {
  id: string;
  category: CakeDecorationCategory;
  placement: "fixed";
  layer: CakeLayerId;
  shapes: Partial<Record<CakeShapeId, { src: string } & CakeBox>>;
  // 그 모양의 그림이 없을 때, 낱개 장식을 윗면 테두리 안쪽을 따라 둘러 대신 그리는 방법.
  rings?: Partial<Record<CakeShapeId, CakeRing>>;
}

export interface CakeRing {
  // 둘러 놓을 낱개 장식의 id.
  part: string;
  count: number;
  // 낱개 장식의 배율.
  scale: number;
  // 윗면 테두리를 가운데 쪽으로 줄인 비율. 이 선 위에 장식의 가운데가 놓인다.
  inset: number;
}

export type CakeDecoration = TopDecoration | FixedDecoration;

function partImage(name: string): string {
  return `/assets/cake-parts/${name}.webp`;
}

function top(
  id: string,
  category: CakeDecorationCategory,
  width: number,
  height: number,
  anchor: TopDecoration["anchor"],
): TopDecoration {
  return {
    id,
    category,
    placement: "top",
    src: partImage(id),
    width,
    height,
    anchor,
  };
}

function fixed(
  id: string,
  category: CakeDecorationCategory,
  layer: CakeLayerId,
  shapes: Partial<
    Record<CakeShapeId, [string, number, number, number, number]>
  >,
): FixedDecoration {
  const entries = Object.entries(shapes).map(
    ([shape, [name, left, top, width, height]]) => [
      shape,
      { src: partImage(name), left, top, width, height },
    ],
  );
  return {
    id,
    category,
    placement: "fixed",
    layer,
    shapes: Object.fromEntries(entries),
  };
}

// 목록의 순서가 수정 화면에 보이는 순서다.
export const CAKE_DECORATIONS: CakeDecoration[] = [
  fixed("frosting-green", "cream", "frosting", {
    round: ["frosting-green-round", 13.1, 143, 618.9, 625],
    heart: ["frosting-green-heart", 55.4, 174.6, 546.4, 589.9],
    square: ["frosting-green-square", -22.7, 113.6, 726.6, 723.9],
  }),
  fixed("frosting-cream", "cream", "frosting", {
    round: ["frosting-cream-round", 31.5, 145.6, 596, 621.9],
    heart: ["frosting-cream-heart", 62.6, 158.3, 557, 589.5],
    square: ["frosting-cream-square", -13.2, 115.1, 695.5, 692.6],
  }),
  fixed("frosting-pinktop", "cream", "frosting", {
    round: ["frosting-pinktop-round", 13.1, 143, 618.9, 625],
    heart: ["frosting-pinktop-heart", 57.3, 154.5, 546.4, 589.9],
    square: ["frosting-pinktop-square", 7.8, 88.9, 659.4, 692.9],
  }),
  fixed("coating-pink", "cream", "frosting", {
    round: ["coating-pink-round", 29, 142, 586, 500.2],
    heart: ["coating-pink-heart", 60, 160.6, 551.9, 487.1],
    // 사각형 코팅은 받은 크기 그대로면 오른쪽 윗모서리로 케이크가 비친다. 3% 키우고 오른쪽으로 옮겼다.
    square: ["coating-pink-square", -21.7, 64, 725.4, 626.1],
  }),
  fixed("coating-choco", "cream", "frosting", {
    round: ["coating-choco-round", 30, 151, 586, 500.2],
    heart: ["coating-choco-heart", 63, 172.5, 525, 463],
    square: ["coating-choco-square", -23.6, 89.9, 716.1, 618.2],
  }),
  fixed("coating-sky", "cream", "frosting", {
    round: ["coating-sky-round", 31, 144, 586, 499.2],
    heart: ["coating-sky-heart", 35.6, 118.7, 583.7, 555.8],
    square: ["coating-sky-square", -23.9, 88.3, 730, 630.2],
  }),
  fixed("cream-top", "cream", "cream-top", {
    round: ["cream-top-round", 48, 143, 564, 403.7],
    heart: ["cream-top-heart", 87, 171.5, 488, 386.3],
    square: ["cream-top-square-plain", -21.1, 123.6, 687.1, 423.2],
  }),
  // 네모 윗면을 덮는 크림. 다른 모양에는 얹을 수 없다.
  fixed("cream-top-square", "cream", "cream-top", {
    square: ["cream-top-square", 29.4, 154.6, 599.7, 361.4],
  }),
  fixed("cream-border", "cream", "cream-border", {
    heart: ["cream-border-heart", 57, 497.9, 538.9, 258.5],
  }),
  // 하트용 그림은 낱개 크림(cream-dollop) 16개를 하트 모양으로 두른 것이다. 다른 모양에서는 같은 크림을 윗면을 따라 두른다.
  {
    ...fixed("cream-piping", "cream", "cream-piping", {
      heart: ["cream-piping-heart", 83, 155.6, 497, 420.2],
    }),
    rings: {
      // 하트는 그림을 쓴다. 이 값은 그림 속 크림이 놓인 자리를 어림하는 데만 쓴다.
      heart: { part: "cream-dollop", count: 16, scale: 0.95, inset: 0.78 },
      round: { part: "cream-dollop", count: 16, scale: 0.95, inset: 0.8 },
      square: { part: "cream-dollop", count: 16, scale: 0.95, inset: 0.78 },
    },
  },
  top("cream-dollop", "cream", 102, 84, "center"),
  top("cream-rosette", "cream", 129, 112, "center"),
  top("cream-ball-white", "cream", 44.4, 42, "center"),
  top("cream-ball-pink", "cream", 44.4, 42, "center"),
  top("cream-ball-yellow", "cream", 44, 42.3, "center"),
  top("cream-ball-sky", "cream", 97, 91.7, "center"),
  top("cream-cloud-sky", "cream", 431.2, 253.7, "center"),
  top("cream-oval-yellow", "cream", 362.8, 185, "center"),
  top("fruit-strawberry-pile", "fruit", 321, 283, "center"),
  top("fruit-strawberry", "fruit", 92, 107, "bottom"),
  top("fruit-cherry", "fruit", 94.8, 152, "bottom"),
  // 크림 위에 얹은 과일. 크림 방울은 cream-dollop과, 장미 크림은 cream-rosette와 같은 크기다.
  top("fruit-strawberry-dollop", "fruit", 117, 151, "bottom"),
  top("fruit-strawberry-rosette", "fruit", 129, 105.5, "bottom"),
  top("fruit-cherry-dollop", "fruit", 118, 179, "bottom"),
  top("fruit-cherry-rosette", "fruit", 115.5, 101.5, "bottom"),
  top("candle-pink", "candle", 21.9, 203.1, "bottom"),
  top("candle-mint", "candle", 21.9, 203.1, "bottom"),
  top("candle-black", "candle", 21.9, 203.1, "bottom"),
  top("candle-yellow", "candle", 21.9, 203.1, "bottom"),
  top("candle-white", "candle", 21.9, 203.1, "bottom"),
  top("candle-purple", "candle", 21.9, 203.1, "bottom"),
  top("candle-wavy", "candle", 40, 223, "bottom"),
  top("candle-wavy-tall", "candle", 58, 321, "bottom"),
  top("topper-star", "candle", 157.8, 179.4, "bottom"),
  top("topper-house", "candle", 151.1, 187.4, "bottom"),
  top("topper-baker", "candle", 137.6, 161, "bottom"),
  top("candle-heart-pink", "candle", 110, 147.1, "bottom"),
  top("candle-heart-blue", "candle", 110, 147.1, "bottom"),
  top("candle-heart-red", "candle", 110, 147.1, "bottom"),
  top("flower-lily-pink", "flower", 159.5, 146, "center"),
  top("flower-lily-silver", "flower", 167.2, 157.5, "center"),
  top("flower-lily-rose", "flower", 215.4, 163.5, "center"),
  top("flower-lily-white", "flower", 244.6, 229.6, "center"),
  top("flower-gerbera-pink", "flower", 152.5, 135, "center"),
  top("petal-pink", "flower", 60.4, 53.9, "center"),
  top("petal-lilac", "flower", 60.4, 53.9, "center"),
  top("flower-gerbera-red", "flower", 155.3, 163.1, "center"),
  top("petal-red", "flower", 60.4, 53.9, "center"),
  top("flower-gerbera-blue", "flower", 152.5, 135, "center"),
  top("petal-blue", "flower", 60.4, 53.9, "center"),
  top("flower-gerbera-purple", "flower", 192.9, 144.2, "center"),
  top("flower-gerbera-lilac", "flower", 247, 215.5, "center"),
  top("petal-purple", "flower", 100.9, 74.6, "center"),
  top("flower-rose", "flower", 140.2, 133.4, "center"),
  top("petal-rose", "flower", 46.1, 45.1, "center"),
  top("petal-navy", "flower", 51.7, 38.1, "center"),
  top("flower-gerbera-stem", "flower", 289.3, 252.5, "center"),
  top("flower-sprig", "flower", 105, 140, "center"),
  top("ribbon-bow-silver", "ribbon", 123.5, 131.2, "center"),
  top("ribbon-bow-pink", "ribbon", 116, 73.7, "center"),
  top("ribbon-knot-pink", "ribbon", 30.2, 24.7, "center"),
  top("ribbon-bow-black", "ribbon", 116, 73.7, "center"),
  top("ribbon-bow-white", "ribbon", 116, 73.7, "center"),
  top("ribbon-bow-wide", "ribbon", 200, 165.4, "center"),
  fixed("ribbon-wrap", "ribbon", "wrap", {
    round: ["ribbon-wrap-round", 59.8, 199.9, 523.8, 520.6],
    heart: ["ribbon-wrap-heart", 88, 257.5, 496, 481],
    square: ["ribbon-wrap-square", 85.6, 208.1, 520.8, 492.4],
  }),
  fixed("ribbon-garland", "ribbon", "garland", {
    round: ["ribbon-garland-round", 72.4, 555.8, 509.5, 120.7],
    heart: ["ribbon-garland-heart", 89, 514.4, 463, 144],
    square: ["ribbon-garland-square", 43.3, 436.7, 577.7, 227.2],
  }),
  fixed("lettering-thankyou", "lettering", "lettering", {
    round: ["lettering-thankyou", 137.2, 225.9, 356.5, 233.4],
    heart: ["lettering-thankyou", 177.8, 277.5, 329.3, 216],
    // 사각형용으로 받은 자리는 없다. 윗면 가운데에 맞춰 놓았다.
    square: ["lettering-thankyou", 157, 240, 320, 210],
  }),
  fixed("lettering-hbd-pink", "lettering", "lettering", {
    // 원형 전용 그림은 없다. 사각형용 그림을 윗면에 맞는 자리에 놓아 쓴다.
    round: ["lettering-hbd-pink-square", 172.5, 298, 315.5, 89.9],
    heart: ["lettering-hbd-pink-heart", 223, 298, 284.4, 164],
    square: ["lettering-hbd-pink-square", 178.7, 300.4, 315.5, 89.9],
  }),
  fixed("lettering-hbd-brown", "lettering", "lettering", {
    heart: ["lettering-hbd-brown-heart", 244.7, 307.3, 282.4, 174.7],
  }),
  fixed("lettering-happy-birthday", "lettering", "lettering", {
    round: ["lettering-happy-birthday-round", 191.9, 276.9, 289.6, 137.7],
    square: ["lettering-happy-birthday-round", 250.6, 321.5, 273, 128.7],
  }),
  fixed("lettering-hbd-dot-black", "lettering", "lettering", {
    heart: ["lettering-hbd-dot-black", 203.3, 271.9, 327.6, 181],
    square: ["lettering-hbd-dot-black", 141.6, 239.8, 375.8, 205.4],
    // 원형용으로 받은 자리는 없다. 윗면 가운데에 맞춰 놓았다.
    round: ["lettering-hbd-dot-black", 190, 228, 327.6, 181],
  }),
  fixed("lettering-hbd-dot-white", "lettering", "lettering", {
    heart: ["lettering-hbd-dot-white", 186.5, 313.6, 344, 190],
    // 원형과 사각형용으로 받은 자리는 없다. 윗면 가운데에 맞춰 놓았다.
    round: ["lettering-hbd-dot-white", 158, 268, 344, 190],
    square: ["lettering-hbd-dot-white", 164, 248, 344, 190],
  }),
  fixed("lettering-hbd-strawberry", "lettering", "lettering", {
    heart: ["lettering-hbd-strawberry", 187.7, 267.9, 367.3, 200.6],
    // 원형과 사각형용으로 받은 자리는 없다. 윗면 가운데에 맞춰 놓았다.
    round: ["lettering-hbd-strawberry", 146.4, 221.7, 367.3, 200.6],
    square: ["lettering-hbd-strawberry", 161.4, 234.7, 367.3, 200.6],
  }),
  fixed("lettering-always-grateful", "lettering", "lettering", {
    round: ["lettering-always-grateful", 196.7, 297.4, 275.7, 163.2],
  }),
  fixed("lettering-job-congrats", "lettering", "lettering", {
    square: ["lettering-job-congrats", 223.1, 328, 204.8, 58.9],
    round: ["lettering-job-congrats", 87.5, 273.5, 484.3, 140.8],
  }),
  // 같은 글자를 남색으로 바꾼 것. Figma에서 색 필터를 걸어 만든 예시(cake-77)에 쓴다.
  fixed("lettering-job-congrats-navy", "lettering", "lettering", {
    square: ["lettering-job-congrats-navy", 223.1, 328, 204.8, 58.9],
    round: ["lettering-job-congrats-navy", 87.5, 273.5, 484.3, 140.8],
  }),
  fixed("lettering-like-you", "lettering", "lettering", {
    square: ["lettering-like-you", 189.5, 231.9, 271.6, 224.1],
    // 원형과 하트용으로 받은 자리는 없다. 윗면 가운데에 맞춰 놓았다.
    round: ["lettering-like-you", 222, 262, 258, 212.9],
    heart: ["lettering-like-you", 252, 308, 222, 183.2],
  }),
  fixed("lettering-i-love-u", "lettering", "lettering", {
    round: ["lettering-i-love-u", 161.4, 285.2, 339.7, 103.5],
    heart: ["lettering-i-love-u", 267.1, 380, 259.4, 78.9],
    square: ["lettering-i-love-u", 167.4, 283.9, 319.7, 97.2],
  }),
  fixed("lettering-i-heart", "lettering", "lettering", {
    round: ["lettering-i-heart", 135.8, 242.1, 376.9, 239.4],
  }),
  fixed("lettering-love-you", "lettering", "lettering", {
    heart: ["lettering-love-you", 227.8, 320.1, 265.2, 94.8],
    // 원형용으로 받은 자리는 없다. 윗면 가운데에 맞춰 놓았다.
    round: ["lettering-love-you", 212, 325, 265.2, 94.8],
  }),
  fixed("lettering-happiness", "lettering", "lettering", {
    heart: ["lettering-happiness", 324.1, 315.1, 157.2, 82.3],
  }),
  fixed("lettering-good-luck", "lettering", "lettering", {
    round: ["lettering-good-luck", 205, 218.6, 256.4, 110.7],
  }),
  fixed("drawing-girl-pink", "lettering", "lettering", {
    round: ["drawing-girl-pink", 143.1, 174.7, 390.2, 401.2],
    // 하트용으로 받은 자리는 없다. 윗면 안에 들어가도록 줄여 놓았다.
    heart: ["drawing-girl-pink", 222, 290, 262, 269.4],
  }),
  fixed("drawing-girl-black", "lettering", "lettering", {
    square: ["drawing-girl-black", 69.8, 242.2, 494.1, 275],
    // 하트용으로 받은 자리는 없다. 윗면 안에 들어가도록 줄여 놓았다.
    heart: ["drawing-girl-black", 158, 304, 380, 211.5],
    // 원형용으로 받은 자리는 없다. 윗면을 채우도록 놓았다.
    round: ["drawing-girl-black", 104, 256, 460, 256],
  }),
  top("drawing-baker-red", "lettering", 86.1, 72.2, "center"),
  fixed("sprinkle", "others", "sprinkle", {
    round: ["sprinkle-round", 82.4, 242.5, 508.4, 238.4],
    heart: ["sprinkle-heart", 113.9, 212.5, 443.1, 303],
    square: ["sprinkle-square", 81, 212.8, 481, 297.8],
  }),
  top("topper-baker-face", "others", 203, 183, "bottom"),
  top("topper-bears", "others", 99.5, 66, "bottom"),
  top("topper-cat-pudding", "others", 168, 166, "bottom"),
  top("topper-cat", "others", 132.4, 107.6, "bottom"),
  top("topper-cat-snowball", "others", 162.1, 108.1, "bottom"),
  top("topper-paws", "others", 86.5, 83, "center"),
  top("sweet-biscuit", "others", 197.5, 190.6, "center"),
  top("sweet-cookie-cat", "others", 223.7, 215.9, "center"),
  top("sweet-pepero", "others", 138.7, 226, "center"),
  top("sweet-wafer", "others", 133, 216.7, "center"),
  top("topper-bear-groom", "others", 114.5, 147.8, "bottom"),
  top("topper-bear-bride", "others", 109.3, 141.1, "bottom"),
  top("plate-choco", "others", 146, 99, "bottom"),
  top("plate-pink", "others", 157, 109, "bottom"),
  top("star-pink", "others", 102, 102, "center"),
  top("star-black", "others", 103, 102, "center"),
  top("star-brown", "others", 103, 102, "center"),
  top("star-white", "others", 91, 86, "center"),
  top("star-mini-pink", "others", 35, 34, "center"),
  top("pearl", "others", 70, 71, "center"),
  top("pearl-gray", "others", 36, 36, "center"),
  top("flower-stem", "flower", 534.8, 547.5, "center"),
  top("lettering-promise", "lettering", 284.8, 224, "center"),
  top("lettering-i-love-u-black", "lettering", 339.7, 103.9, "center"),
  // 진주 알로 쓴 비즈 글자. 수정 화면에서 고르는 한 장짜리 그림이다.
  top("lettering-pearl-love", "lettering", 300, 262.5, "center"),
  top("lettering-pearl-d-heart-gray", "lettering", 232.9, 116.5, "center"),
  // 노란 판에 얼굴과 글자를 얹은 이름표. 판은 cream-oval-yellow와 같은 크기다.
  top("plate-yellow-love", "lettering", 362.8, 186.2, "center"),
  top("plate-yellow-good-luck", "lettering", 362.8, 186.2, "center"),
  top("plate-yellow-happiness", "lettering", 362.8, 186.2, "center"),
  top("lettering-chukahae-hearts", "lettering", 330, 114.4, "center"),
  top("lettering-chukahaeyo", "lettering", 322, 109.9, "center"),
  top("note-married", "lettering", 262, 165.9, "center"),
  top("note-anniversary", "lettering", 262, 166, "center"),
  top("lettering-ouen-pink", "lettering", 292, 165.8, "center"),
  top("lettering-ouen-black", "lettering", 292, 165.8, "center"),
  top("lettering-ouen-sky", "lettering", 292, 165.8, "center"),
  top("lettering-gomawo-black", "lettering", 471.7, 231.5, "center"),
  top("lettering-happy-birthday-brown", "lettering", 110.4, 34.9, "center"),
  top("lettering-gomawo-pink", "lettering", 372.3, 196.9, "center"),
  top("lettering-gomawo-sky", "lettering", 372.3, 189.5, "center"),
  top("lettering-thankyou-color", "lettering", 463.1, 310.4, "center"),
  top("lettering-thankyou-sky", "lettering", 427.5, 286.5, "center"),
  top("lettering-thx-star-black", "lettering", 274, 114.9, "center"),
  top("lettering-thx-star-white", "lettering", 274, 114.5, "center"),
  top("topper-paw", "others", 38, 30.5, "center"),
  top("topper-wing", "others", 63.2, 68.9, "center"),
  top("plate-omedetou", "others", 181.2, 55.5, "bottom"),
  top("plate-congratulations", "others", 181.2, 67.4, "bottom"),
  top("plate-chukahae", "others", 218.7, 66.2, "bottom"),
  top("star-yellow", "others", 85.7, 72.5, "center"),
  top("drop-black-oval", "others", 55.3, 46.8, "center"),
  top("drop-black-round", "others", 55.2, 52.4, "center"),
  top("drop-white-oval", "others", 49.9, 42.2, "center"),
  top("drop-white-round", "others", 50, 47.5, "center"),
  top("splat-red-1", "others", 102.6, 80.9, "center"),
  top("splat-red-2", "others", 134.1, 79.3, "center"),
  top("splat-red-3", "others", 73, 61, "center"),
];

export interface CakeSticker {
  src: string;
  width: number;
  height: number;
  anchor: "bottom" | "center";
}

// 관람객이 스티커처럼 놓고 옮길 수 있는 장식이면 그 그림과 크기를, 아니면 undefined를 돌려준다.
// 낱개 장식은 모두 놓을 수 있다. 케이크 모양별 자리가 정해진 장식 가운데는 글자만 놓을 수 있고,
// 지금 모양의 그림이 없으면 다른 모양의 그림을 쓴다.
export function stickerOf(
  item: CakeDecoration | undefined,
  shape: CakeShapeId,
): CakeSticker | undefined {
  if (!item) return undefined;
  if (item.placement === "top") return item;
  if (item.layer !== "lettering") return undefined;
  const part =
    item.shapes[shape] ??
    CAKE_SHAPES.flatMap((one) => item.shapes[one.id] ?? [])[0];
  return part && { ...part, anchor: "center" };
}

export interface CakeSpot {
  x: number;
  y: number;
}

// 모양별 윗면의 자리. 고른 부품을 앞에서부터 하나씩 채우고, 자리가 모자라면 남은 부품은 그리지 않는다.
export const CAKE_SPOTS: Record<CakeShapeId, CakeSpot[]> = {
  round: [
    { x: 330, y: 410 },
    { x: 200, y: 380 },
    { x: 460, y: 380 },
    { x: 260, y: 500 },
    { x: 400, y: 500 },
    { x: 330, y: 300 },
  ],
  heart: [
    { x: 320, y: 440 },
    { x: 220, y: 400 },
    { x: 430, y: 370 },
    { x: 270, y: 510 },
    { x: 400, y: 490 },
    { x: 330, y: 330 },
  ],
  square: [
    { x: 337, y: 350 },
    { x: 220, y: 370 },
    { x: 450, y: 340 },
    { x: 300, y: 440 },
    { x: 430, y: 420 },
    { x: 330, y: 260 },
  ],
};

export interface CakeTop {
  center: CakeSpot;
  // 윗면의 테두리를 따라 한 바퀴 도는 점들.
  outline: CakeSpot[];
  // 케이크의 아래쪽 윤곽을 왼쪽에서 오른쪽으로 따라가는 점들.
  // 첫 점과 끝 점은 옆면을 타고 올라간 자리다. 바닥은 그 사이이고, 바닥을 따라 놓는 장식은 그 사이에만 놓는다.
  floor: CakeSpot[];
  // 옆면이 앞면과 오른쪽 면으로 나뉘는 자리의 x. 원형은 꺾이지 않지만 옆으로 돌아 들어가기 시작하는 자리를 적는다.
  cornerX: number;
}

type Points = [number, number][];

function spots(points: Points): CakeSpot[] {
  return points.map(([x, y]) => ({ x, y }));
}

function ellipse(center: CakeSpot, radiusX: number, radiusY: number) {
  return Array.from({ length: 36 }, (_, index): [number, number] => {
    const angle = (index / 36) * Math.PI * 2;
    return [
      center.x + Math.cos(angle) * radiusX,
      center.y + Math.sin(angle) * radiusY,
    ];
  });
}

function topOf(
  center: CakeSpot,
  outline: Points,
  floor: Points,
  cornerX: number,
): CakeTop {
  return { center, outline: spots(outline), floor: spots(floor), cornerX };
}

// 모양별 윗면의 가운데와 테두리, 아래쪽 윤곽. 바탕 그림에서 잰 값이다.
// 모양을 바꿨을 때 장식을 새 모양의 같은 자리로 옮기는 데 쓴다.
export const CAKE_TOPS: Record<CakeShapeId, CakeTop> = {
  round: topOf(
    { x: 330, y: 374 },
    ellipse({ x: 330, y: 374 }, 282, 212),
    [
      [46, 452],
      [62, 618],
      [91, 667],
      [139, 713],
      [187, 739],
      [234, 752],
      [282, 759],
      [330, 760],
      [377, 759],
      [425, 746],
      [472, 733],
      [520, 707],
      [568, 654],
      [598, 618],
      [614, 419],
    ],
    430,
  ),
  heart: topOf(
    { x: 345, y: 405 },
    [
      [559, 434],
      [548, 473],
      [535, 509],
      [519, 543],
      [499, 576],
      [464, 593],
      [418, 586],
      [383, 578],
      [355, 572],
      [331, 567],
      [308, 560],
      [287, 553],
      [266, 546],
      [243, 539],
      [218, 528],
      [189, 516],
      [155, 498],
      [112, 468],
      [92, 434],
      [83, 391],
      [92, 348],
      [117, 311],
      [153, 285],
      [194, 272],
      [236, 271],
      [273, 277],
      [304, 286],
      [331, 302],
      [369, 217],
      [418, 194],
      [469, 195],
      [516, 213],
      [554, 247],
      [574, 294],
      [576, 345],
      [569, 392],
    ],
    [
      [83, 430],
      [82, 558],
      [122, 626],
      [163, 664],
      [205, 687],
      [246, 709],
      [288, 717],
      [330, 724],
      [371, 730],
      [413, 731],
      [454, 730],
      [496, 709],
      [537, 656],
      [553, 620],
      [577, 445],
    ],
    460,
  ),
  square: topOf(
    { x: 336, y: 344 },
    [
      [650, 258],
      [483, 534],
      [10, 420],
      [201, 164],
    ],
    [
      [9, 430],
      [32, 647],
      [487, 756],
      [628, 516],
      [650, 270],
    ],
    487,
  ),
};

export function cakeBaseImage(shape: CakeShapeId, color: CakeColorId): string {
  return `/assets/cake-parts/base-${color}-${shape}.webp`;
}
