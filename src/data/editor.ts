import {
  CAKE_COLORS,
  CAKE_SHAPES,
  type CakeColorId,
  type CakeShapeId,
  type CakeSizeId,
  cakeBaseImage,
} from "./cake";

export const EDITOR_TEXT =
  "어떤 걸 수정하면 좋을까요?\n각 항목을 선택하여 자유롭게 커스텀 해주세요!";

export const EDITOR_PACK_CHOICE = "이대로 포장할래!";

// 목록의 순서가 탭 줄에 보이는 순서다.
export const EDITOR_TABS = [
  { id: "size", label: "크기" },
  { id: "shape", label: "모양" },
  { id: "color", label: "색상" },
] as const;

export type EditorTabId = (typeof EDITOR_TABS)[number]["id"];

export interface TileIcon {
  src: string;
  width: number;
  height: number;
}

// 타일에 그리는 케이크 모양 그림. 크기는 가장 큰 케이크일 때의 것이다.
export const SHAPE_ICONS: Record<CakeShapeId, TileIcon> = {
  round: { src: "/assets/title/size-1.svg", width: 150.66, height: 117.85 },
  heart: { src: "/assets/title/size-heart.svg", width: 149, height: 124.8 },
  square: { src: "/assets/ui/shape-square.svg", width: 166, height: 118.7 },
};

// 크기 타일에서 모양 그림을 줄여 그리는 배율.
export const SIZE_ICON_SCALES: Record<CakeSizeId, number> = {
  large: 1,
  medium: 0.82,
  mini: 0.64,
};

// 모양 이름 앞에 붙는 기호.
export const SHAPE_MARKS: Record<CakeShapeId, string> = {
  round: "●",
  heart: "♥",
  square: "■",
};

// 색상 타일의 그림에 입히는 색.
export const COLOR_TINTS: Record<CakeColorId, string> = {
  white: "#ffffff",
  pink: "#fff2f9",
  black: "#323232",
  yellow: "#ffface",
  sky: "#ecfaff",
  choco: "#786157",
};

// 케이크 창에서 케이크를 그리는 판의 아래쪽 가운데가 놓이는 자리와, 판을 그리는 배율. 좌표는 창의 왼쪽 위가 기준이다.
export const WINDOW_CAKE = { centerX: 469, bottom: 706, scale: 0.67 };

const browser = (name: string) => `/assets/ui/browser/${name}`;

export const BROWSER_IMAGES = {
  nav: browser("nav.svg"),
  maximize: browser("maximize.svg"),
  close: browser("close.svg"),
  clear: browser("clear.svg"),
  face: browser("face.svg"),
};

// 모양과 색상을 바꾸면 바로 보여야 하므로 케이크 바탕 그림을 모두 받아 둔다.
export const EDITOR_IMAGES = [
  ...Object.values(BROWSER_IMAGES),
  ...Object.values(SHAPE_ICONS).map((icon) => icon.src),
  ...CAKE_SHAPES.flatMap((shape) =>
    CAKE_COLORS.map((color) => cakeBaseImage(shape.id, color.id)),
  ),
];
