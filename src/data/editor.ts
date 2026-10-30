import {
  CAKE_BOARD,
  CAKE_COLORS,
  CAKE_DECORATIONS,
  CAKE_SHAPES,
  type CakeColorId,
  type CakeLayerId,
  type CakeShapeId,
  type CakeSizeId,
  cakeBaseImage,
  stickerOf,
} from "./cake";
import { BLACK_DROPS, type DropSpot, WHITE_DROPS } from "./drops";

export const EDITOR_TEXT =
  "어떤 걸 수정하면 좋을까요?\n각 항목을 선택하여 자유롭게 커스텀 해주세요!";

export const EDITOR_PACK_CHOICE = "이대로 포장할래!";
export const EDITOR_MENU_CHOICE = "menu";

// 창의 X와 지우개를 누르면 뜨는 확인 팝업. confirm은 실행하는 쪽, cancel은 돌아가는 쪽 선택지다.
export const EDITOR_QUIT = {
  label: "케이크 수정 그만두기",
  message:
    "케이크 수정을 그만둘까요?\n현재까지의 수정 내용은 저장되지 않습니다.",
  confirm: "그만두기",
  cancel: "계속하기",
};

export const EDITOR_HISTORY_LABELS = { undo: "실행 취소", redo: "다시 실행" };

export const EDITOR_ERASE = {
  label: "장식 모두 지우기",
  message: "현재의 장식 요소를 모두 제거할까요?",
  confirm: "제거하기",
  cancel: "취소",
};

// 목록의 순서가 탭 줄에 보이는 순서다.
export const EDITOR_TABS = [
  { id: "size", label: "크기" },
  { id: "shape", label: "모양" },
  { id: "topping", label: "토핑" },
  { id: "lettering", label: "레터링" },
  { id: "decoration", label: "장식" },
  { id: "color", label: "색상" },
] as const;

export type EditorTabId = (typeof EDITOR_TABS)[number]["id"];

export interface TileIcon {
  src: string;
  width: number;
  height: number;
  // 타일 안에서 그림의 가운데가 놓이는 높이. 없으면 109다.
  centerY?: number;
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

const editorImage = (name: string) => `/assets/ui/editor/${name}`;

export interface EditorCategory {
  id: string;
  // 줄을 나눌 자리에는 줄바꿈 문자를 넣는다.
  label: string;
  icon: TileIcon;
  // 목록에 나오는 장식. 순서가 목록에 보이는 순서다. 묶음(DECORATION_SETS)의 id도 올 수 있다.
  items: string[];
}

// 레터링 탭 분류 타일의 그림. 다섯 장 모두 같은 크기의 판에 그려져 있다.
const letteringIcon = (name: string): TileIcon => ({
  src: editorImage(`category-${name}.svg`),
  width: 150,
  height: 160,
  centerY: 115,
});

// 레터링 탭의 분류. 목록의 순서가 타일 줄에 보이는 순서다.
export const LETTERING_CATEGORIES: EditorCategory[] = [
  {
    id: "birthday",
    label: "BIRTHDAY",
    icon: letteringIcon("birthday"),
    items: [
      "lettering-hbd-dot-black",
      "lettering-hbd-dot-white",
      "lettering-hbd-strawberry",
      "lettering-hbd-pink",
      "lettering-hbd-brown",
      "lettering-happy-birthday",
    ],
  },
  {
    id: "love",
    label: "LOVE",
    icon: letteringIcon("love"),
    items: [
      "lettering-i-heart",
      "lettering-love-you",
      "lettering-i-love-u",
      "lettering-i-love-u-black",
      "plate-yellow-love",
      "lettering-pearl-love",
      "lettering-pearl-d-heart-gray",
      "lettering-promise",
      "lettering-like-you",
    ],
  },
  {
    id: "thanks",
    label: "THANKS",
    icon: letteringIcon("thanks"),
    items: [
      "lettering-thankyou",
      "lettering-thankyou-sky",
      "lettering-thankyou-color",
      "lettering-gomawo-black",
      "lettering-gomawo-pink",
      "lettering-gomawo-sky",
      "lettering-always-grateful",
      "lettering-thx-star-black",
      "lettering-thx-star-white",
    ],
  },
  {
    id: "daily",
    label: "DAILY",
    icon: letteringIcon("daily"),
    items: [
      "plate-yellow-good-luck",
      "lettering-job-congrats",
      "lettering-chukahae-hearts",
      "lettering-chukahaeyo",
      "note-married",
      "note-anniversary",
    ],
  },
  {
    id: "japanese",
    label: "JAPANESE/\nDRAWING",
    icon: letteringIcon("japanese"),
    items: [
      "plate-yellow-happiness",
      "lettering-ouen-pink",
      "lettering-ouen-black",
      "lettering-ouen-sky",
      "drawing-girl-pink",
      "drawing-girl-black",
    ],
  },
];

// 토핑 탭의 분류. 목록의 순서가 타일 줄에 보이는 순서다.
// centerY는 타일(270x275) 안에서 그림의 가운데가 놓이는 높이다.
export const TOPPING_CATEGORIES: EditorCategory[] = [
  {
    id: "fruit",
    label: "FRUIT",
    icon: {
      src: editorImage("category-fruit.svg"),
      width: 105,
      height: 109,
      centerY: 122.9,
    },
    items: [
      "fruit-strawberry",
      "fruit-strawberry-dollop",
      "fruit-strawberry-rosette",
      "fruit-cherry",
      "fruit-cherry-dollop",
      "fruit-cherry-rosette",
    ],
  },
  {
    id: "cream",
    label: "CREAM",
    icon: {
      src: editorImage("category-cream.svg"),
      width: 91,
      height: 91,
      centerY: 127,
    },
    items: [
      "cream-top",
      "cream-piping",
      "cream-dollop",
      "cream-rosette",
      "cream-cloud-sky",
      "cream-ball-pink",
      "cream-ball-white",
      "cream-ball-yellow",
      "cream-ball-sky",
    ],
  },
  {
    id: "chocolate",
    label: "CHOCOLATE",
    icon: {
      src: editorImage("category-chocolate.svg"),
      width: 122,
      height: 122,
      centerY: 119,
    },
    items: [
      "plate-pink",
      "plate-choco",
      "plate-chukahae",
      "plate-congratulations",
      "plate-omedetou",
    ],
  },
  {
    id: "sweets",
    label: "SWEETS",
    icon: {
      src: editorImage("category-sweets.svg"),
      width: 115,
      height: 115,
      centerY: 117.5,
    },
    items: [
      "sprinkle",
      "sweet-cookie-cat",
      "sweet-biscuit",
      "sweet-pepero",
      "sweet-wafer",
      "topper-cat-pudding",
    ],
  },
  {
    id: "coating",
    label: "COATING",
    icon: {
      src: editorImage("category-coating.svg"),
      width: 108,
      height: 119,
      centerY: 111.1,
    },
    items: [
      "frosting-cream",
      "frosting-green",
      "frosting-pinktop",
      "coating-choco",
      "coating-pink",
      "coating-sky",
    ],
  },
];

// 장식 탭의 분류. 목록의 순서가 타일 줄에 보이는 순서다.
export const DECORATION_CATEGORIES: EditorCategory[] = [
  {
    id: "candle",
    label: "CANDLE",
    icon: {
      src: editorImage("category-candle.svg"),
      width: 20.19,
      height: 164.8,
      centerY: 103.4,
    },
    items: [
      "candle-pink",
      "candle-mint",
      "candle-black",
      "candle-yellow",
      "candle-white",
      "candle-purple",
      "topper-star",
      "topper-house",
      "topper-baker",
      "candle-heart-red",
      "candle-heart-pink",
      "candle-heart-blue",
      "candle-wavy",
      "candle-wavy-tall",
    ],
  },
  {
    id: "flower",
    label: "FLOWER",
    icon: {
      src: editorImage("category-flower.svg"),
      width: 115.2,
      height: 115.2,
      centerY: 111.6,
    },
    items: [
      "flower-lily-white",
      "flower-lily-pink",
      "flower-lily-silver",
      "flower-lily-rose",
      "flower-gerbera-pink",
      "petal-pink",
      "flower-gerbera-lilac",
      "petal-lilac",
      "flower-gerbera-red",
      "petal-red",
      "flower-gerbera-blue",
      "petal-blue",
      "flower-gerbera-purple",
      "petal-purple",
      "flower-rose",
      "petal-rose",
      "flower-gerbera-stem",
      "flower-sprig",
      "flower-stem",
    ],
  },
  {
    id: "ribbon",
    label: "RIBBON",
    icon: {
      src: editorImage("category-ribbon.svg"),
      width: 114.2,
      height: 96.36,
      centerY: 121.6,
    },
    items: [
      "ribbon-bow-silver",
      "ribbon-bow-pink",
      "ribbon-bow-black",
      "ribbon-bow-white",
      "ribbon-wrap",
      "ribbon-garland",
    ],
  },
  {
    id: "others",
    label: "OTHERS",
    icon: {
      src: editorImage("category-others.svg"),
      width: 112,
      height: 107,
      centerY: 115.2,
    },
    items: [
      "topper-wing",
      "topper-bears",
      "pearl-gray",
      "pearl",
      "star-pink",
      "star-black",
      "star-brown",
      "star-white",
      "topper-cat",
      "topper-cat-snowball",
      "topper-paws",
      "splat-red-1",
      "splat-red-2",
      "splat-red-3",
      "drops-black",
      "drops-white",
    ],
  },
];

const dropThumb = (color: string, sizes: Record<CakeShapeId, number[]>) =>
  Object.fromEntries(
    Object.entries(sizes).map(([shape, [width, height]]) => [
      shape,
      { src: editorImage(`drops-${color}-${shape}.webp`), width, height },
    ]),
  ) as Record<CakeShapeId, { src: string; width: number; height: number }>;

// 한 번 누르면 여러 장식을 한꺼번에 놓는 묶음. 놓인 뒤에는 장식마다 따로 옮기고 지울 수 있다.
// thumbs는 목록에 보이는 그림이고, parts는 지금 모양의 케이크에서 장식마다 놓이는 자리다.
export const DECORATION_SETS: Record<
  string,
  {
    thumbs: Record<CakeShapeId, { src: string; width: number; height: number }>;
    parts: Record<CakeShapeId, DropSpot[]>;
  }
> = {
  "drops-black": {
    thumbs: dropThumb("black", {
      heart: [171.3, 168],
      round: [154.3, 150.5],
      square: [182.3, 155.3],
    }),
    parts: BLACK_DROPS,
  },
  "drops-white": {
    thumbs: dropThumb("white", {
      heart: [170, 164.3],
      round: [151.8, 149.5],
      square: [180.5, 150.3],
    }),
    parts: WHITE_DROPS,
  },
};

// 목록에서 고른 장식을 놓을 때의 배율. 기본 크기가 목록의 다른 장식과 맞지 않는 것만 적는다.
// 하늘색 공은 완성 케이크 예시에서 크게 쓰여 기본 크기가 다른 공의 두 배쯤이다.
export const DECORATION_PLACE_SCALES: Record<string, number> = {
  "cream-ball-sky": 0.46,
};

export const LIST_CLOSE_IMAGE = editorImage("list-close.svg");
export const ERASER_IMAGE = editorImage("eraser.svg");
export const LIST_CLOSE_LABEL = "분류로 돌아가기";

// 분류를 누른 뒤 고른 상태를 보여 주고 목록으로 넘어가기까지의 시간.
export const CATEGORY_HOLD_MS = 250;

// 목록에서 장식 그림을 그리는 가장 큰 크기. 이보다 큰 그림은 줄여 그린다.
const CHOICE_MAX = { width: 230, height: 227 };

export interface DecorationChoice {
  id: string;
  src: string;
  width: number;
  height: number;
  caption?: string;
}

// 목록에서 일본어 글자 아래에 붙이는 한국어 뜻.
export const DECORATION_CAPTIONS: Record<string, string> = {
  "plate-yellow-happiness": "행복하세요",
  "lettering-ouen-pink": "항상 응원할게",
  "lettering-ouen-black": "항상 응원할게",
  "lettering-ouen-sky": "항상 응원할게",
};

// 분류를 고르는 탭과 그 탭의 분류.
export const EDITOR_CATEGORIES: Partial<Record<EditorTabId, EditorCategory[]>> =
  {
    topping: TOPPING_CATEGORIES,
    lettering: LETTERING_CATEGORIES,
    decoration: DECORATION_CATEGORIES,
  };

// 분류의 목록에서 지금 케이크에 놓을 수 있는 것. 케이크 모양을 따라 그린 장식은 그 모양의 그림이 있는 것만 나오고,
// 예시에 처음부터 있던 장식이 차지한 층(held)의 것은 나오지 않는다. 스티커로 놓는 글자는 늘 나온다.
export function decorationChoices(
  category: EditorCategory,
  shape: CakeShapeId,
  held: ReadonlySet<CakeLayerId> = new Set(),
): DecorationChoice[] {
  return category.items.flatMap((id) => {
    const set = DECORATION_SETS[id];
    if (set) return [{ id, ...set.thumbs[shape] }];
    const item = CAKE_DECORATIONS.find((one) => one.id === id);
    if (!item) return [];
    const sticker = stickerOf(item, shape);
    if (!sticker && item.placement === "fixed" && held.has(item.layer)) {
      return [];
    }
    const part =
      sticker ?? (item.placement === "fixed" ? item.shapes[shape] : undefined);
    if (!part) return [];
    const scale = Math.min(
      DECORATION_PLACE_SCALES[id] ?? 1,
      CHOICE_MAX.width / part.width,
      CHOICE_MAX.height / part.height,
    );
    const caption = DECORATION_CAPTIONS[id];
    return [
      {
        id,
        src: part.src,
        width: part.width * scale,
        height: part.height * scale,
        ...(caption ? { caption } : {}),
      },
    ];
  });
}

// 케이크 창에서 고른 장식에 두르는 조절 상자. 간격은 장식 그림에서 상자까지의 거리이고, 장식을 키워도 같다.
export const CONTROL_BOX = { gapX: 23, gapY: 25 };

// 장식을 줄이고 키울 수 있는 한도. 기본 크기에 대한 배율이다.
export const DECORATION_SCALE = { min: 0.4, max: 2.5 };

// 장식을 옮길 수 있는 범위. 케이크 창의 모눈 영역이고, 좌표는 창의 왼쪽 위가 기준이다.
export const WINDOW_GRID = { left: 37, top: 191, width: 877, height: 545 };

export const CONTROL_IMAGES = {
  remove: editorImage("handle-delete.svg"),
  scale: editorImage("handle-scale.svg"),
  rotate: editorImage("handle-rotate.svg"),
};

export const CONTROL_LABELS = {
  move: "장식 옮기기",
  remove: "장식 지우기",
  scale: "장식 크기 조절",
  rotate: "장식 기울기 조절",
  release: "장식 선택 풀기",
};

// 케이크 창에서 케이크를 그리는 판의 아래쪽 가운데가 놓이는 자리와, 판을 그리는 배율. 좌표는 창의 왼쪽 위가 기준이다.
export const WINDOW_CAKE = { centerX: 469, bottom: 706, scale: 0.67 };

// 케이크는 크기를 줄이면 판의 아래쪽을 기준으로 줄어든다. 케이크 창에서는 줄어든 케이크가 아래로 처지지 않고
// 제자리에서 작아지도록, 케이크 바탕의 가운데가 내려간 만큼 판을 위로 올린다. size는 케이크 크기의 배율이다.
export function windowCakeLift(size: number): number {
  const baseMiddle = (CAKE_BOARD.height - CAKE_BOARD.headroom) / 2;
  return (1 - size) * baseMiddle * WINDOW_CAKE.scale;
}

const browser = (name: string) => `/assets/ui/browser/${name}`;

export const BROWSER_IMAGES = {
  backOn: browser("back-on.svg"),
  backOff: browser("back-off.svg"),
  forwardOn: browser("forward-on.svg"),
  forwardOff: browser("forward-off.svg"),
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
  LIST_CLOSE_IMAGE,
  ERASER_IMAGE,
  ...Object.values(CONTROL_IMAGES),
  ...Object.values(EDITOR_CATEGORIES).flatMap((categories) =>
    categories.map((category) => category.icon.src),
  ),
  // 목록을 열거나 모양을 바꿨을 때 빈 칸이 보이지 않도록 장식과 글자 그림도 받아 둔다.
  ...new Set(
    Object.values(EDITOR_CATEGORIES).flatMap((categories) =>
      categories.flatMap((category) =>
        CAKE_SHAPES.flatMap((shape) =>
          decorationChoices(category, shape.id).map((choice) => choice.src),
        ),
      ),
    ),
  ),
];
