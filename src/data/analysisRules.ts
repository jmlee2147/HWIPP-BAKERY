import type { CakeColorId, CakeDecorationCategory, CakeSizeId } from "./cake";
import type { FlavorId } from "./flavors";
import type { PartyId } from "./parties";
import type { RelationId } from "./relations";
import type { StyleId } from "./styles";

// 파티 테마별로 어울리는 케이크의 조건. 크기는 그대로 쓰고, 나머지는 완성 케이크 예시 중 하나를 고를 때 쓴다.
export interface PartyRule {
  size: CakeSizeId;
  // 이 테마의 케이크에 적혀 있어야 하는 글자. 비어 있으면 글자가 없어도 된다.
  messages: string[];
  // 이 분류의 장식이 얹혀 있으면 더 어울린다.
  categories: CakeDecorationCategory[];
  // 장식 개수의 범위. 화려한 케이크는 많게, 소박한 케이크는 적게 잡는다.
  minCount?: number;
  maxCount?: number;
}

export const PARTY_RULES: Record<PartyId, PartyRule> = {
  birthday: {
    size: "large",
    messages: [
      "lettering-hbd-pink",
      "lettering-hbd-brown",
      "lettering-hbd-dot-black",
      "lettering-hbd-dot-white",
      "lettering-hbd-strawberry",
      "lettering-happy-birthday",
    ],
    categories: ["candle"],
  },
  // 장식이 12개 이상이면 화려한 케이크로, 11개 이하면 소박한 케이크로 본다. 어느 예시든 둘 중 하나에는 든다.
  event: { size: "large", messages: [], categories: [], minCount: 12 },
  comfort: {
    size: "medium",
    messages: [
      "lettering-thankyou",
      "lettering-always-grateful",
      "lettering-job-congrats",
      "lettering-good-luck",
    ],
    categories: [],
  },
  daily: { size: "mini", messages: [], categories: [], maxCount: 11 },
  wedding: {
    size: "large",
    messages: [
      "lettering-love-you",
      "lettering-i-love-u",
      "lettering-i-heart",
      "lettering-promise",
      "lettering-like-you",
      "lettering-happiness",
    ],
    categories: ["flower", "ribbon"],
  },
};

const CELEBRATIONS: PartyId[] = ["birthday", "event", "wedding"];
const LOVE: PartyId[] = ["wedding", "daily", "event"];
const THANKS: PartyId[] = ["comfort", "daily", "event"];

// 글자가 적힌 장식과, 그 글자가 어울리는 파티 테마. 여기 없는 테마의 케이크에는 그 글자가 나오지 않는다.
// 생일 글자는 생일에만, 결혼 축하 인사(お幸せに)는 웨딩에만 나온다.
export const MESSAGE_PARTIES: Record<string, PartyId[]> = {
  "lettering-hbd-pink": ["birthday"],
  "lettering-hbd-brown": ["birthday"],
  "lettering-hbd-dot-black": ["birthday"],
  "lettering-hbd-dot-white": ["birthday"],
  "lettering-hbd-strawberry": ["birthday"],
  "lettering-happy-birthday": ["birthday"],
  "lettering-thankyou": THANKS,
  "lettering-always-grateful": THANKS,
  "lettering-job-congrats": ["comfort", "event"],
  "lettering-good-luck": ["comfort", "event"],
  "lettering-love-you": LOVE,
  "lettering-i-love-u": LOVE,
  "lettering-i-heart": LOVE,
  "lettering-promise": LOVE,
  "lettering-like-you": LOVE,
  "lettering-happiness": ["wedding"],
  "plate-choco": LOVE,
  "plate-omedetou": CELEBRATIONS,
  "plate-chukahae": CELEBRATIONS,
};

// 사랑을 말하는 글자. 웨딩이 아닌 테마에서는 친구와 동료에게 주는 케이크에 나오지 않는다.
export const LOVE_MESSAGES = [
  "lettering-love-you",
  "lettering-i-love-u",
  "lettering-i-heart",
  "plate-choco",
];

// 연인 사이의 고백에 가까운 글자. 테마와 상관없이 연인과 최애에게 주는 케이크에만 나온다.
export const CONFESSIONS = ["lettering-promise", "lettering-like-you"];

// 사랑을 말하는 글자가 어울리는 관계.
export const CLOSE_RELATIONS: RelationId[] = ["couple", "idol"];
// 웨딩이 아닌 테마에서 사랑을 말하는 글자를 피하는 관계.
export const DISTANT_RELATIONS: RelationId[] = ["friend", "colleague"];

// 받는 사람의 스타일별 취향. 장식 가운데 취향에 맞는 것의 비율이 높을수록, 바탕색이 맞을수록 어울린다.
export interface StyleTaste {
  // 장식 id가 이 중 하나로 시작하면 취향에 맞는다.
  decorations: string[];
  // 이 바탕색이면 취향에 맞는다.
  colors: CakeColorId[];
  // true면 장식이 적을수록 취향에 맞는다. decorations는 보지 않는다.
  sparse?: boolean;
}

export const STYLE_TASTES: Record<StyleId, StyleTaste> = {
  trendsetter: {
    decorations: ["ribbon-", "candle-heart-", "lettering-hbd-dot-"],
    colors: ["black", "sky"],
  },
  "aesthetic-curator": {
    decorations: ["flower-", "petal-", "pearl"],
    colors: ["white"],
  },
  "cute-collector": {
    decorations: ["topper-", "plate-", "fruit-", "sprinkle", "cream-rosette"],
    colors: ["pink", "yellow", "choco"],
  },
  minimalist: {
    decorations: [],
    colors: ["white"],
    sparse: true,
  },
  "subculture-digger": {
    decorations: ["drawing-", "splat-", "drop-", "star-black"],
    colors: ["black"],
  },
};

// 맛 답변 가운데 케이크의 모습으로 나타낼 수 있는 것. 나머지 답변(덜 달게, 알레르기, 가리는 것 없음)은 모습에 드러나지 않아 여기 없다.
export interface FlavorRule {
  // 이 바탕색의 케이크는 나오지 않는다.
  avoidColors: CakeColorId[];
  // 장식 id가 이 중 하나로 시작하는 케이크는 나오지 않는다.
  avoid: string[];
  // 비어 있지 않으면, 이 중 하나로 시작하는 장식이 얹힌 케이크만 나온다.
  require: string[];
  // 이 중 하나로 시작하는 장식이 있으면 덜 어울린다.
  dislike: string[];
}

export const FLAVOR_RULES: Partial<Record<FlavorId, FlavorRule>> = {
  // 초코나 치즈같이 무거운 건 별로야
  rich: {
    avoidColors: ["choco"],
    avoid: ["coating-choco", "plate-choco"],
    require: [],
    dislike: [],
  },
  // 크림 듬뿍보다 제철 과일 듬뿍
  fruit: {
    avoidColors: [],
    avoid: [],
    require: ["fruit-"],
    dislike: ["frosting-", "coating-", "cream-top", "cream-piping"],
  },
};
