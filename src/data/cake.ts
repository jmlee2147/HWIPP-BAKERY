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
}

export interface CakeConfig {
  size: CakeSizeId;
  shape: CakeShapeId;
  color: CakeColorId;
  // 얹을 장식. 목록에 없는 id는 그릴 때 버린다.
  decorations: CakeDecorationItem[];
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
export const CAKE_LAYERS = [
  "frosting",
  "coating",
  "cream-top",
  "cream-border",
  "cream-piping",
  "sprinkle",
  "garland",
  "lettering",
  "wrap",
] as const;

export type CakeLayerId = (typeof CAKE_LAYERS)[number];

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
  }),
  fixed("frosting-cream", "cream", "frosting", {
    round: ["frosting-cream-round", 32, 130, 599, 625],
  }),
  fixed("frosting-pinktop", "cream", "frosting", {
    round: ["frosting-pinktop-round", 13.1, 143, 618.9, 625],
  }),
  fixed("coating-pink", "cream", "coating", {
    round: ["coating-pink-round", 29, 142, 586, 500.2],
    heart: ["coating-pink-heart", 60, 160.6, 551.9, 487.1],
  }),
  fixed("coating-choco", "cream", "coating", {
    round: ["coating-choco-round", 30, 151, 586, 500.2],
    heart: ["coating-choco-heart", 63, 172.5, 525, 463],
  }),
  fixed("coating-sky", "cream", "coating", {
    round: ["coating-sky-round", 31, 144, 586, 499.2],
  }),
  fixed("cream-top", "cream", "cream-top", {
    heart: ["cream-top-heart", 87, 171.5, 488, 386.3],
  }),
  fixed("cream-border", "cream", "cream-border", {
    heart: ["cream-border-heart", 57, 497.9, 538.9, 258.5],
  }),
  fixed("cream-piping", "cream", "cream-piping", {
    heart: ["cream-piping-heart", 83, 155.6, 497, 420.2],
  }),
  top("cream-dollop", "cream", 102, 84, "center"),
  top("cream-rosette", "cream", 129, 112, "center"),
  top("cream-ball-white", "cream", 44.4, 42, "center"),
  top("cream-ball-pink", "cream", 44.4, 42, "center"),
  top("cream-ball-sky", "cream", 97, 91.7, "center"),
  top("cream-cloud-sky", "cream", 431.2, 253.7, "center"),
  top("fruit-strawberry-pile", "fruit", 321, 283, "center"),
  top("fruit-strawberry", "fruit", 92, 107, "bottom"),
  top("fruit-cherry", "fruit", 94.8, 152, "bottom"),
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
  top("flower-gerbera-pink", "flower", 152.5, 135, "center"),
  top("petal-pink", "flower", 60.4, 53.9, "center"),
  top("flower-gerbera-red", "flower", 155.3, 163.1, "center"),
  top("petal-red", "flower", 60.4, 53.9, "center"),
  top("flower-gerbera-blue", "flower", 152.5, 135, "center"),
  top("petal-blue", "flower", 60.4, 53.9, "center"),
  top("flower-gerbera-purple", "flower", 192.9, 144.2, "center"),
  top("petal-purple", "flower", 100.9, 74.6, "center"),
  top("flower-rose", "flower", 140.2, 133.4, "center"),
  top("petal-rose", "flower", 46.1, 45.1, "center"),
  top("flower-gerbera-stem", "flower", 289.3, 252.5, "center"),
  top("flower-sprig", "flower", 105, 140, "center"),
  top("ribbon-bow-silver", "ribbon", 123.5, 131.2, "center"),
  top("ribbon-bow-pink", "ribbon", 116, 73.7, "center"),
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
  }),
  fixed("lettering-hbd-pink", "lettering", "lettering", {
    heart: ["lettering-hbd-pink-heart", 300.6, 321.5, 284.4, 164],
    square: ["lettering-hbd-pink-square", 178.7, 300.4, 315.5, 89.9],
  }),
  fixed("lettering-hbd-brown", "lettering", "lettering", {
    heart: ["lettering-hbd-brown-heart", 244.7, 307.3, 282.4, 174.7],
  }),
  fixed("lettering-happy-birthday", "lettering", "lettering", {
    round: ["lettering-happy-birthday-round", 191.9, 276.9, 289.6, 137.7],
  }),
  fixed("lettering-hbd-dot-black", "lettering", "lettering", {
    heart: ["lettering-hbd-dot-black", 203.3, 271.9, 327.6, 181],
    square: ["lettering-hbd-dot-black", 141.6, 239.8, 375.8, 205.4],
  }),
  fixed("lettering-hbd-dot-white", "lettering", "lettering", {
    heart: ["lettering-hbd-dot-white", 186.5, 313.6, 344, 190],
  }),
  fixed("lettering-hbd-strawberry", "lettering", "lettering", {
    heart: ["lettering-hbd-strawberry", 187.7, 267.9, 367.3, 200.6],
  }),
  fixed("lettering-always-grateful", "lettering", "lettering", {
    round: ["lettering-always-grateful", 196.7, 297.4, 275.7, 163.2],
  }),
  fixed("lettering-job-congrats", "lettering", "lettering", {
    square: ["lettering-job-congrats", 223.1, 328, 204.8, 58.9],
  }),
  fixed("lettering-like-you", "lettering", "lettering", {
    square: ["lettering-like-you", 189.5, 231.9, 271.6, 224.1],
  }),
  fixed("lettering-i-love-u", "lettering", "lettering", {
    round: ["lettering-i-love-u", 161.4, 285.2, 339.7, 103.5],
  }),
  fixed("lettering-i-heart", "lettering", "lettering", {
    round: ["lettering-i-heart", 135.8, 242.1, 376.9, 239.4],
  }),
  fixed("lettering-love-you", "lettering", "lettering", {
    heart: ["lettering-love-you", 227.8, 320.1, 265.2, 94.8],
  }),
  fixed("sprinkle", "others", "sprinkle", {
    round: ["sprinkle-round", 82.4, 242.5, 508.4, 238.4],
    heart: ["sprinkle-heart", 113.9, 212.5, 443.1, 303],
    // 사각형 전용 그림은 없다. 하트용 그림을 같은 비율로 줄여 쓴다.
    square: ["sprinkle-heart", 124.3, 226.8, 394.4, 269.7],
  }),
  top("topper-baker-face", "others", 203, 183, "bottom"),
  top("topper-cat-pudding", "others", 168, 166, "bottom"),
  top("topper-cat", "others", 132.4, 107.6, "bottom"),
  top("topper-paws", "others", 86.5, 83, "center"),
  top("plate-choco", "others", 146, 99, "bottom"),
  top("plate-pink", "others", 157, 109, "bottom"),
  top("star-pink", "others", 102, 102, "center"),
  top("star-black", "others", 103, 102, "center"),
  top("star-brown", "others", 103, 102, "center"),
  top("star-white", "others", 91, 86, "center"),
  top("star-mini-pink", "others", 35, 34, "center"),
  top("pearl", "others", 70, 71, "center"),
  top("pearl-gray", "others", 36, 36, "center"),
  top("cream-top-square", "cream", 599.7, 361.4, "center"),
  top("flower-stem", "flower", 534.8, 547.5, "center"),
  top("lettering-promise", "lettering", 284.8, 224, "center"),
  top("topper-paw", "others", 38, 30.5, "center"),
  top("topper-wing", "others", 63.2, 68.9, "center"),
  top("plate-omedetou", "others", 181.2, 55.5, "bottom"),
  top("plate-chukahae", "others", 218.7, 66.2, "bottom"),
  top("star-yellow", "others", 85.7, 72.5, "center"),
  top("drop-black-oval", "others", 55.3, 46.8, "center"),
  top("drop-black-round", "others", 55.2, 52.4, "center"),
  top("splat-red-1", "others", 102.6, 80.9, "center"),
  top("splat-red-2", "others", 134.1, 79.3, "center"),
  top("splat-red-3", "others", 73, 61, "center"),
];

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

export function cakeBaseImage(shape: CakeShapeId, color: CakeColorId): string {
  return `/assets/cake-parts/base-${color}-${shape}.webp`;
}
