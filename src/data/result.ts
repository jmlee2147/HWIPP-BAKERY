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

// 배경색 위에 흐린 원 세 개를 겹친 그림. 흐림 효과를 실행 중에 걸지 않도록 미리 그려 두었다.
export const RESULT_GLOW_IMAGE = "/assets/backgrounds/result-glow.webp";

// 뚜껑이 열린 케이크 상자. 로고와 HAVE A GOOD DAY!까지 그려져 있고 케이크, 날짜, 순번은 비어 있다.
export const CAKE_BOX_IMAGE = "/assets/result/cake-box.webp";
export const CAKE_BOX = { width: 934, height: 1193 };

// 아래 좌표는 모두 상자 그림의 왼쪽 위를 기준으로 한다.

// 케이크를 그리는 판의 아래쪽 가운데가 상자에서 놓이는 자리와, 가장 큰 케이크를 그리는 배율.
// 하트 케이크의 바탕이 상자 바닥의 점무늬가 비어 있는 자리에 오도록 맞췄다.
export const BOX_CAKE = { centerX: 435.5, bottom: 983.7, scale: 0.85 };

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

// 답변별 키워드. 디자인에는 예시 한 벌(이벤트에 쓰일 / 트렌디한 걸 좋아하는 / 친구에게 전해주고 싶은 / 달지 않은 케이크)만 있어,
// 나머지는 같은 말투로 채웠다. 태그가 화면 오른쪽 끝을 넘지 않도록 짧게 쓴다.
export const PARTY_KEYWORDS: Record<PartyId, string> = {
  birthday: "생일을 축하할",
  event: "이벤트에 쓰일",
  comfort: "위로와 응원을 전할",
  daily: "오늘을 기념할",
  wedding: "결혼을 축하할",
};

export const STYLE_KEYWORDS: Record<StyleId, string> = {
  trendsetter: "트렌디한 걸 좋아하는",
  "aesthetic-curator": "감성 있는 걸 좋아하는",
  "cute-collector": "귀여운 걸 좋아하는",
  minimalist: "심플한 걸 좋아하는",
  "subculture-digger": "독특한 걸 좋아하는",
};

export const RELATION_KEYWORDS: Record<RelationId, string> = {
  couple: "연인에게 전해주고 싶은",
  family: "가족에게 전해주고 싶은",
  friend: "친구에게 전해주고 싶은",
  colleague: "동료에게 전해주고 싶은",
  idol: "최애에게 전해주고 싶은",
};

export const FLAVOR_KEYWORDS: Record<FlavorId, string> = {
  rich: "담백한 케이크",
  sweet: "달지 않은 케이크",
  allergy: "걱정 없는 케이크",
  fruit: "과일 듬뿍 케이크",
  anything: "취향 저격 케이크",
};

export const RESULT_FLAVOR_SUFFIX = " 완성되었습니다!";

// 키워드 태그 네 개의 자리. 왼쪽 끝을 맞추고 길이는 글자를 따라 늘어난다.
export const RESULT_KEYWORD_TAGS: {
  answer: "party" | "style" | "relation" | "flavor";
  tone: KeywordTone;
  left: number;
  top: number;
}[] = [
  { answer: "party", tone: "mint", left: 692.63, top: 660.23 },
  { answer: "style", tone: "lime", left: 752.25, top: 729.23 },
  { answer: "relation", tone: "white", left: 692.63, top: 798.23 },
  { answer: "flavor", tone: "cocoa", left: 657.21, top: 867.12 },
];

export const RESULT_IMAGES = [RESULT_GLOW_IMAGE, CAKE_BOX_IMAGE];
