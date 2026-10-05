import type { CakeSizeId } from "./cake";
import type { SceneBox } from "./opening";

export const RESULT_TEXT =
  "짜잔! 손님의 대답을 토대로 세상에 하나뿐인\n케이크가 구워졌어요~";

export const RESULT_CHOICES = {
  edit: "조금만 수정해 볼래!",
  keep: "맘에 들어 ! 이대로 줘",
};

export const SHOWCASE_IMAGE = "/assets/backgrounds/showcase.webp";
export const SHOWCASE: SceneBox = {
  left: -181,
  top: -2,
  width: 1442,
  height: 1922,
};

// 아래 좌표는 모두 주문서 카드의 왼쪽 위를 기준으로 한다.

// 케이크를 그리는 판의 아래쪽 가운데가 카드에서 놓이는 자리와, 가장 큰 케이크를 그리는 배율.
export const CARD_CAKE = { centerX: 343.5, bottom: 920.5, scale: 0.8724 };

// 카드에서는 작은 케이크도 종이를 넉넉히 채우도록 크기 차이를 줄여 보여 준다.
export const CARD_CAKE_SIZES: Record<CakeSizeId, number> = {
  large: 1,
  medium: 0.9,
  mini: 0.8,
};

const title = (name: string) => `/assets/title/${name}`;

// 케이크 이름표. 고른 케이크와 상관없이 늘 같은 자리에 붙어 있다.
export const CARD_LABELS = [
  {
    src: title("label-strawberry-shortcake.svg"),
    tag: { left: 40.31, top: 401, width: 107.53 },
    text: { left: 48.24, top: 409.5, width: 91.68, height: 11.91 },
    faded: true,
  },
  {
    src: title("label-cherry-choco.svg"),
    tag: { left: 510, top: 202, width: 135.03 },
    text: { left: 524.6, top: 209.63, width: 105.83, height: 13.73 },
    faded: false,
  },
  {
    src: title("label-rating.png"),
    tag: { left: 93.81, top: 429.54, width: 77.69 },
    text: { left: 101.55, top: 437.26, width: 68.5, height: 15.7 },
    faded: true,
  },
  {
    src: title("label-angel-roll.svg"),
    tag: { left: 54, top: 282, width: 107.53 },
    text: { left: 63.82, top: 290.53, width: 87.15, height: 11.66 },
    faded: true,
  },
  {
    src: title("label-choco-berry.svg"),
    tag: { left: 492.52, top: 314.09, width: 128.31 },
    text: { left: 506.26, top: 322.55, width: 99.9, height: 12.06 },
    faded: true,
  },
  {
    src: title("label-heart-choco.svg"),
    tag: { left: 75.31, top: 921, width: 119.4 },
    text: { left: 84.8, top: 929.78, width: 100.43, height: 11.82 },
    faded: true,
  },
];

export const CARD_HEARTS = [
  { left: 540.78, top: 282.32 },
  { left: 71.31, top: 779 },
  { left: 601.31, top: 570 },
];

export const CARD_PLUS_ONES = [
  {
    star: { left: 402.31, top: 222.57, size: 41.02 },
    text: { left: 448.51, top: 227.63, size: 28.27 },
  },
  {
    star: { left: 407.85, top: 266.09, size: 35.45 },
    text: { left: 447.79, top: 270.47, size: 24.43 },
  },
  {
    star: { left: 419.23, top: 306.27, size: 24.04 },
    text: { left: 446.32, top: 309.24, size: 16.57 },
  },
];

const DOT_COLOR = "#e2dcd9";
export const DOT_SIZE = 8.6;

// 점 무늬 한 묶음에서 점마다의 왼쪽 위 좌표.
const DOTS = [
  [204.3, 185.9],
  [231.3, 177.6],
  [177.6, 194.3],
  [293.2, 187.9],
  [150.7, 202.6],
  [119.2, 6.3],
  [80.5, 165.7],
  [127.6, 33.4],
  [132.2, 237.9],
  [123.8, 211],
  [196.1, 159.2],
  [179.5, 105.6],
  [224.9, 62],
  [212.8, 212.9],
  [82.2, 76.8],
  [162.6, 51.8],
  [260, 80.6],
  [99, 130.5],
  [229.6, 266.6],
  [241.5, 115.7],
  [268.2, 107.7],
  [115.7, 184.3],
  [206.3, 97.3],
  [90.5, 103.7],
  [152.6, 113.9],
  [233.1, 88.8],
  [55.5, 85.2],
  [187.7, 132.6],
  [249.7, 142.6],
  [134, 148.9],
  [107.3, 157.4],
  [221.3, 239.7],
  [258.1, 169.3],
  [53.5, 173.8],
  [142.5, 176],
  [234.8, 0],
  [117.3, 95.7],
  [125.8, 122.2],
  [286.9, 72.3],
  [26.7, 182.5],
  [144.4, 87.2],
  [223, 151],
  [198, 70.4],
  [243.3, 26.8],
  [169.1, 167.9],
  [214.7, 124.2],
  [161.1, 140.7],
  [171.7, 78.7],
  [216.5, 35.3],
  [154.6, 25.1],
  [136.2, 60.8],
  [113.5, 273.3],
  [313.5, 64.2],
  [0, 190.9],
  [284.8, 161.6],
  [88.7, 192.7],
  [47, 61.1],
  [266.6, 196.2],
  [190.4, 44.2],
];

// 점 하나를 그림자로 여러 번 찍어, 요소 하나로 한 묶음을 그린다.
export const DOT_SHADOW = DOTS.map(
  ([x, y]) => `${x}px ${y}px 0 0 ${DOT_COLOR}`,
).join(", ");

// 같은 묶음을 세 군데에 놓는다. 종이 밖으로 나간 점은 잘린다.
export const CARD_DOT_GROUPS = [
  { left: 378, top: 385 },
  { left: 95, top: 151 },
  { left: -58, top: 532 },
];

export const CLOVER_IMAGE = "/assets/ui/clover.svg";
export const PLUS_STAR_IMAGE = title("star.svg");
export const LOGO_IMAGES = {
  hwipp: "/assets/logo/hwipp-card.svg",
  bakery: "/assets/logo/bakery-dots-outline.svg",
};

export const RESULT_IMAGES = [
  SHOWCASE_IMAGE,
  CLOVER_IMAGE,
  PLUS_STAR_IMAGE,
  LOGO_IMAGES.hwipp,
  LOGO_IMAGES.bakery,
  ...CARD_LABELS.map((label) => label.src),
];
