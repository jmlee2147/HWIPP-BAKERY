import type { CakeDecorationCategory, CakeSizeId } from "./cake";
import type { PartyId } from "./parties";
import type { StyleId } from "./styles";

// 파티 테마별로 어울리는 케이크의 조건. 크기는 그대로 쓰고, 나머지는 완성 케이크 예시 중 하나를 고를 때 쓴다.
export interface PartyRule {
  size: CakeSizeId;
  // 이 분류의 장식이 얹혀 있으면 어울린다.
  categories: CakeDecorationCategory[];
  // 이 중 하나라도 얹혀 있으면 더 잘 어울린다.
  decorations: string[];
  // 장식 개수의 범위. 화려한 케이크는 많게, 소박한 케이크는 적게 잡는다.
  minCount?: number;
  maxCount?: number;
}

export const PARTY_RULES: Record<PartyId, PartyRule> = {
  birthday: {
    size: "large",
    categories: ["candle", "lettering"],
    decorations: [
      "lettering-hbd-pink",
      "lettering-hbd-brown",
      "lettering-hbd-dot-black",
      "lettering-hbd-dot-white",
      "lettering-hbd-strawberry",
      "lettering-happy-birthday",
    ],
  },
  event: {
    size: "large",
    categories: [],
    decorations: [],
    minCount: 14,
  },
  comfort: {
    size: "medium",
    categories: ["lettering"],
    decorations: [
      "lettering-thankyou",
      "lettering-always-grateful",
      "lettering-job-congrats",
      "lettering-good-luck",
      "lettering-happiness",
    ],
  },
  daily: {
    size: "mini",
    categories: [],
    decorations: [],
    maxCount: 8,
  },
  wedding: {
    size: "large",
    categories: ["lettering", "flower", "ribbon"],
    decorations: [
      "lettering-love-you",
      "lettering-i-love-u",
      "lettering-i-heart",
      "lettering-happiness",
    ],
  },
};

// 받는 사람의 스타일별 취향. 조건이 같은 예시가 여럿일 때 이 취향에 맞는 것을 먼저 고른다.
export interface StyleTaste {
  // 장식 id가 이 중 하나로 시작하면 취향에 맞는다.
  decorations: string[];
  // 장식이 이 개수 이하면 취향에 맞는다.
  maxCount?: number;
}

export const STYLE_TASTES: Record<StyleId, StyleTaste> = {
  trendsetter: {
    decorations: ["ribbon-", "candle-heart-", "lettering-hbd-dot-"],
  },
  "aesthetic-curator": {
    decorations: ["flower-", "petal-", "pearl"],
  },
  "cute-collector": {
    decorations: ["topper-", "plate-", "fruit-"],
  },
  minimalist: {
    decorations: [],
    maxCount: 6,
  },
  "subculture-digger": {
    decorations: ["drawing-", "splat-", "drop-black-", "star-black"],
  },
};
