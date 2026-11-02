import type { CakeSizeId } from "./cake";
import type { FlavorId } from "./flavors";
import type { PartyId } from "./parties";
import type { RelationId } from "./relations";
import type { StyleId } from "./styles";

export const RESULT_TEXT =
  "짜잔! 손님의 대답을 토대로 세상에 하나뿐인\n케이크가 구워졌어요~";

export const RESULT_CHOICES = {
  menu: "메뉴판에서 고를래",
  edit: "조금만 수정해 볼래!",
  keep: "맘에 들어 ! 이대로 줘",
};

// 연분홍 바탕 위에 떠다니는 흐린 원. 흐림 효과를 실행 중에 걸지 않도록 작게 그려 둔 그림을 크게 늘려 놓는다.
export interface Glow {
  src: string;
  left: number;
  top: number;
  size: number;
}

const glow = (name: string) => `/assets/backgrounds/glow-${name}.webp`;
export const GLOW_IMAGES = {
  mint: glow("mint"),
  blush: glow("blush"),
  pink: glow("pink"),
  gray: glow("gray"),
};

export const RESULT_GLOWS: Glow[] = [
  { src: GLOW_IMAGES.mint, left: -431, top: 380, size: 1384 },
  { src: GLOW_IMAGES.pink, left: 208, top: 314, size: 1150 },
  { src: GLOW_IMAGES.gray, left: 291, top: 794, size: 1150 },
];

// 뚜껑이 열린 케이크 상자. 로고와 HAVE A GOOD DAY!까지 그려져 있고 케이크, 날짜, 순번은 비어 있다.
export const CAKE_BOX_IMAGE = "/assets/result/cake-box.webp";
export const CAKE_BOX = { width: 934, height: 1193 };

// 아래 좌표는 모두 상자 그림의 왼쪽 위를 기준으로 한다.

// 케이크를 그리는 판의 아래쪽 가운데가 상자에서 놓이는 자리와, 가장 큰 케이크를 그리는 배율.
// 하트 케이크의 바탕이 상자 바닥의 점무늬가 비어 있는 자리에 오도록 맞췄다.
export const BOX_CAKE = { centerX: 435.5, bottom: 983.7, scale: 0.85 };

// 케이크 바닥이 놓일 수 있는 상자 바닥면의 좌우. 상자 그림의 왼쪽 위가 기준이다.
// 바닥면은 원근 때문에 기울어진 네모라 높이마다 좌우가 다르다. 케이크 바닥이 놓이는
// 높이(BOX_CAKE.bottom)에서 잰 값이다. 시안의 바닥면 꼭짓점은
// 뒤왼쪽 (1, 719), 뒤오른쪽 (582, 545), 앞오른쪽 (932, 1005), 앞왼쪽 (313, 1190)이다.
export const BOX_FLOOR = { left: 176, right: 916 };

// 케이크 그림 전체가 넘어가면 안 되는 위아래 한계. 위는 상자 윗변 가까이,
// 아래는 바닥면의 앞쪽이다. 장식을 옮기거나 키워 이 범위를 넘으면 전체를 그만큼 줄여 담는다.
export const BOX_CAKE_AREA = { top: 10, bottom: 1150 };

// 상자에서는 작은 케이크도 바닥을 넉넉히 채우도록 크기 차이를 줄여 보여 준다.
export const BOX_CAKE_SIZES: Record<CakeSizeId, number> = {
  large: 1,
  medium: 0.9,
  mini: 0.8,
};

// 날짜와 순번은 상자의 뒷판에 비스듬히 적힌다. 뒷판의 기울기는 화면을 오른쪽으로 눕힌 좌표계에서 잡혀 있어,
// 그 좌표계를 상자 위에 그대로 옮겨 놓고 글자를 그 안에 둔다.
export const BOX_STAMP_FRAME = { left: -55, top: -500 };
export const BOX_STAMPS = {
  date: { centerX: 1177.23, top: 84.63, width: 45.917, height: 100.456 },
  orderNumber: { centerX: 1144.96, top: 85.73, width: 31.941, height: 48.296 },
};

// 상자를 화면에 놓는 자리.
export const RESULT_BOX_POSITION = { left: 55, top: 500 };

export type KeywordTone = "mint" | "lime" | "white" | "cocoa";

// 답변별 키워드. 디자이너가 정한 문구표를 따른다.
export const PARTY_KEYWORDS: Record<PartyId, string> = {
  birthday: "생일 축하에 쓰일",
  event: "이벤트에 쓰일",
  comfort: "위로와 응원의 마음을 담아",
  daily: "더 기쁜 일상을 위한",
  wedding: "약혼을 기념할",
};

export const STYLE_KEYWORDS: Record<StyleId, string> = {
  trendsetter: "트렌디한 걸 좋아하는",
  "aesthetic-curator": "미감 좋은",
  "cute-collector": "귀여운 걸 사랑하는",
  minimalist: "심플한 게 취향인",
  "subculture-digger": "독특한 취향을 가진",
};

export const RELATION_KEYWORDS: Record<RelationId, string> = {
  couple: "연인에게 전해주고 싶은",
  family: "가족에게 전해주고 싶은",
  friend: "친구에게 전해주고 싶은",
  colleague: "동료에게 전해주고 싶은",
  idol: "최애에게 전해주고 싶은",
};

export const FLAVOR_KEYWORDS: Record<FlavorId, string> = {
  rich: "초코 또는 치즈가 빠진 케이크",
  sweet: "달지 않은 케이크",
  allergy: "알레르기 걱정 없는 케이크",
  fruit: "과일올린 케이크",
  anything: "하나뿐인 케이크",
};

export const RESULT_FLAVOR_SUFFIX = ", 완성되었습니다!";

// 키워드 태그 네 개의 자리. 위의 셋은 왼쪽 끝을 맞추고, 길이가 크게 달라지는 맛 태그는
// 화면 밖으로 나가지 않도록 오른쪽 끝을 맞춘다. 길이는 글자를 따라 늘어난다.
export type KeywordSlot = {
  answer: "party" | "style" | "relation" | "flavor";
  tone: KeywordTone;
  top: number;
} & ({ left: number } | { rightEdge: number });

export const RESULT_KEYWORD_TAGS: KeywordSlot[] = [
  { answer: "party", tone: "mint", left: 692.63, top: 660.23 },
  { answer: "style", tone: "lime", left: 752.25, top: 729.23 },
  { answer: "relation", tone: "white", left: 692.63, top: 798.23 },
  { answer: "flavor", tone: "cocoa", rightEdge: 1026.21, top: 867.12 },
];

export const RESULT_IMAGES = [
  GLOW_IMAGES.mint,
  GLOW_IMAGES.pink,
  GLOW_IMAGES.gray,
  CAKE_BOX_IMAGE,
];
