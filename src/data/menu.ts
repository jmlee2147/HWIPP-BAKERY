import type { CakeShapeId } from "./cake";
import { CAKE_PRESETS, type CakePreset } from "./cakePresets";
import { GLOW_IMAGES, type Glow } from "./result";

export const MENU_TEXT =
  "예시로 제작된 HWIPP! BAKERY의 케이크 디자인이에요.\n여기서 빠르게 선택도 가능해요!";
export const MENU_PACK_CHOICE = "이 디자인으로 포장할래";
export const MENU_BACK_LABEL = "이전 화면으로 돌아가기";
export const MENU_CLOSE_LABEL = "크게 보기 닫기";

const menuImage = (name: string) => `/assets/menu/${name}`;

export const MENU_IMAGES = {
  clip: menuImage("clip.webp"),
  paper: menuImage("paper.webp"),
  title: menuImage("title.svg"),
  star: menuImage("star.svg"),
  back: menuImage("back.svg"),
  close: menuImage("close.svg"),
};

// 아래 탭. 고른 탭의 그림은 분홍으로 칠해져 있다. left와 top은 탭 판 안에서 그림이 놓이는 자리다.
export const MENU_TABS: {
  shape: CakeShapeId;
  label: string;
  on: string;
  off: string;
  left: number;
  top: number;
}[] = [
  {
    shape: "round",
    label: "원형 케이크",
    on: menuImage("tab-round-on.svg"),
    off: menuImage("tab-round-off.svg"),
    left: 52,
    top: 21,
  },
  {
    shape: "heart",
    label: "하트 케이크",
    on: menuImage("tab-heart-on.svg"),
    off: menuImage("tab-heart-off.svg"),
    left: 186,
    top: 21.8,
  },
  {
    shape: "square",
    label: "사각형 케이크",
    on: menuImage("tab-square-on.svg"),
    off: menuImage("tab-square-off.svg"),
    left: 320.7,
    top: 21.8,
  },
];

// 탭에 보여 줄 완성 케이크 예시. 그 모양으로 만든 예시를 데이터에 적힌 순서대로 보여 준다.
export function menuCakes(shape: CakeShapeId): CakePreset[] {
  return CAKE_PRESETS.filter((preset) => preset.cake.shape === shape);
}

// 케이크 목록의 칸. 칸마다 케이크 바탕의 가운데를 칸의 가운데에 맞춘다.
export const MENU_GRID = {
  columns: 4,
  cellWidth: 203.4,
  cellHeight: 222,
  paddingLeft: 27.3,
  paddingTop: 25,
  paddingBottom: 40,
  // 케이크 바탕을 그리는 너비. 모양마다 바탕 그림의 너비가 달라, 배율을 모양별로 맞춰 너비를 같게 한다.
  baseWidth: 172,
};

// 크게 보기 팝업에서 케이크 바탕의 가운데가 놓이는 자리와 바탕의 너비. 팝업의 왼쪽 위를 기준으로 한다.
export const MENU_POPUP_CAKE = { centerX: 390, centerY: 379, baseWidth: 486 };

// 흐린 원. 연분홍 바탕 위에 떠다닌다.
export const MENU_GLOWS: Glow[] = [
  { src: GLOW_IMAGES.mint, left: -376.5, top: -74, size: 1384 },
  { src: GLOW_IMAGES.blush, left: -416.5, top: 429, size: 1384 },
  { src: GLOW_IMAGES.pink, left: 262.5, top: -140, size: 1150 },
  { src: GLOW_IMAGES.gray, left: 345.5, top: 340, size: 1150 },
  { src: GLOW_IMAGES.mint, left: -657.5, top: 415, size: 1582 },
  { src: GLOW_IMAGES.pink, left: 267.5, top: 503, size: 1150 },
  { src: GLOW_IMAGES.gray, left: 244.5, top: 775, size: 1150 },
];

export const MENU_PRELOAD = [
  ...Object.values(MENU_IMAGES),
  ...MENU_TABS.flatMap((tab) => [tab.on, tab.off]),
];
