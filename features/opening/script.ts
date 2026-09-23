import type { CardKey } from '@/components/motion/variants'
import type { ChoiceVariant } from '@/components/ui/ChoiceButton'
import type { MetaBox, RotatedBox } from '@/lib/config/artboard'

/**
 * 오프닝 내러티브. Figma `전시 디자인 공유 / 오프닝` 섹션. 전체 8컷이 여기 있다.
 *
 * | # | Figma | 내용 |
 * | 1 | 1:78009  | HWIPP! BAKERY 타이틀 + START! |
 * | 2 | 1:79803  | 가게 외관, 문 닫힘            |
 * | 3 | 21:39293 | 문 열림                       |
 * | 4 | 1:80189  | 매장 내부 — "예약하신 분이신가요?" (선택지 2) |
 * | 5 | 1:80792  | "세상에 단 하나뿐인 맞춤 케이크" |
 * | 6 | 1:80638  | 케이크 그래픽 등장            |
 * | 7 | 1:80921  | "두 사람의 이야기와 추억을"    |
 * | 8 | 1:80488  | "어떤 분을 위한 케이크를?" → STEP.1 |
 *
 * 컷 4 선택지 분기: "아니요, 예약 안 했어요" → 컷 8,
 * "여기는 뭐하는 곳이에요?" → 컷 5~7 안내 후 컷 8.
 */

/**
 * 좌표는 전부 회전 아트보드 기준이다. 변환은 `lib/config/artboard.ts` 가 한다.
 * 컷 2와 3은 배경 말고 모든 요소의 좌표가 같아 레이아웃을 공유한다.
 */
export const OPENING_LAYOUT = {
  background: { left: 0, top: 0, width: 1920, height: 1080 },
  dialog: { left: 1538.86, top: 59, width: 319.133, height: 962.444 },
  hint: { left: 109, top: 362, width: 93, height: 357 },
} as const satisfies Record<string, RotatedBox>

/**
 * 간판 로고. 배경 일러스트의 간판은 빈 면이라 로고를 여기서 얹는다.
 *
 * Figma 는 이것을 판·하트·워드마크·BAKERY 네 겹으로 그리고 그룹에 `hard-light` 를 건다.
 * **합쳐서 내보낸 이미지를 쓰면 안 된다** — 판 원본은 진한 갈색이고, 흰 간판과 곱해져서
 * 화면의 로즈색이 된다. 내보내기 결과물은 그 blend 가 이미 반영된 밝은 색이라
 * 다시 blend 하면 두 번 밝아진다.
 */
export const SIGN_LAYOUT = {
  plate: { left: 1237.38, top: 362, width: 223.615, height: 356.236 },
  // Figma inset `40.78% 25.46% 39.59% 65.11%` 를 루트(1920×1080) 기준으로 환산한 값
  heart: { left: 1250.11, top: 440.42, width: 181.06, height: 212.01 },
  wordmark: { left: 1313.45, top: 413.04, width: 108, height: 267 },
  bakery: { left: 1281.08, top: 447.54, width: 40.29, height: 187.801 },
} as const satisfies Record<string, RotatedBox>

/** 워드마크는 Starshines 로 직접 그린다. 이미지로 굽지 않는다. */
export const WORDMARK_FONT_SIZE = 71.649

/**
 * 하단 안내문 타이포. Figma 텍스트 스타일로 등록되어 있지 않아 여기 둔다.
 * PF Stardust ExtraBold 800 · 40px · 줄높이 93px · 자간 -2.5% · #FFFFFF.
 * 외곽선은 없다 — 글자 윤곽은 분홍 그림자(`--text-shadow-hint`)뿐이다.
 */
export const HINT_TYPE = {
  fontSize: 40,
  lineHeight: '93px',
  letterSpacing: '-0.025em', // Figma 의 -2.5 는 px 가 아니라 % 다
} as const

/**
 * 컷 1 타이틀. 좌표는 Figma `get_metadata` 값 그대로이고 변환은 `fromArtboardMeta()` 가 한다.
 *
 * 액자 판 세 장(갈색 테두리·안쪽 면·위쪽 판)은 전부 단색이라 이미지로 두지 않는다 —
 * 파일은 3KB 남짓이지만 디코딩은 19.8MB 를 먹는다 (`.claude/rules/assets.md`).
 */
export const TITLE_LAYOUT = {
  board: { x: 1615.566, y: 50.586, width: 974.832, height: 1408.368 },
  boardInner: { x: 1581.551, y: 89.141, width: 897.731, height: 1330.268 },
  panelTop: { x: 1516.426, y: 103.656, width: 868.995, height: 407.355 },
  clip: { x: 1808, y: 375.57, width: 324.869, height: 324.869 },
  topbar: { x: 1920, y: 0, width: 1080, height: 163 },
  logoSmall: { x: 1896, y: 864, width: 186, height: 97.417 },
  startButton: { x: 146, y: 172, width: 734.603, height: 83 },
} as const satisfies Record<string, MetaBox>

/**
 * 벽지. 노드는 1634×1898 이지만 Figma 가 화면에 걸치는 부분만 잘라서 내보낸다.
 * 그래서 노드 좌표가 아니라 **잘린 뒤 화면에 놓이는 자리**를 적는다.
 * 노드가 y 153 에서 시작하고 화면 아래까지 이어지므로 세로는 1920-153 이다.
 */
export const WALL_BOX = { left: 0, top: 153, width: 1080, height: 1767 }

/**
 * 에셋은 Figma 에서 2x 로 내보낸다. 화면에는 절반으로 놓는다.
 *
 * 내보낸 그림은 그림자·이펙트까지 포함해 노드 박스보다 조금 크다(2.00~2.29x).
 * 그래서 노드 박스에 억지로 맞추지 않고 **노드 중심에 원본 비율 그대로** 얹는다 —
 * 크기를 코드에 적지 않아도 되도록 CSS 로 처리한다 (`TitleScene` 의 `Pinned`).
 */
export const ASSET_SCALE = 0.5

/**
 * 중앙 로고. 별 배경 · 판 · 하트 · 글자를 따로 쌓는다.
 *
 * 합쳐서 내보낸 한 장을 쓰면 별이 판에 붙어버려 움직일 수 없다.
 * 판·하트·BAKERY 는 간판 로고(컷 2)와 같은 그림이라 그대로 재사용한다.
 * 측정해 보면 **별 배경만 기울어져 있고 판과 글자는 수평**이다.
 */
export const LOGO_LAYOUT = {
  plate: { x: 1094.777, y: 228.781, width: 582.452, height: 365.615 },
  heart: { x: 1046.018, y: 357.061, width: 346.58, height: 296.089 },
  wordmark: { x: 1030.109, y: 312.227, width: 436, height: 176 },
  bakery: { x: 866.477, y: 368.649, width: 307.061, height: 65.876 },
} as const satisfies Record<string, MetaBox>

/** 별판 기울기(도). 내보낸 그림에서 위쪽 모서리 기울기를 재어 얻었다. */
export const LOGO_STAR_TILT = 4.28

/**
 * 별판 창. 기울어져 있어 **회전 전 크기**로 둔다 —
 * 메타데이터가 주는 846.585×467.356 은 회전 후 바운딩이라 그대로 쓰면 창이 커진다.
 */
export const LOGO_STAR_WINDOW = { left: 121.118, top: 812.324, width: 818.462, height: 407.410 }

/** 별 그림은 창보다 크다. 창 기준 상대 위치와 크기. */
export const LOGO_STAR_IMAGE = { left: -286.147, top: -157.161, width: 1304.675, height: 869.783 }

/**
 * 별 무늬가 한 번 반복되는 거리. 끝없이 흐르게 하려면 이 값이 정확해야 한다 —
 * 틀리면 되감는 순간 무늬가 튄다.
 *
 * 원본(966×644)에서 별 중심을 검출해 실측한 값이 가로 84.691px, 행 간격 55.065px 이고
 * 행이 반 칸씩 엇갈리므로 세로 주기는 그 두 배다. 화면에는 1304.675px 폭으로 놓이므로
 * 1.35060 배를 곱한다. 그림을 다시 받으면 다시 재야 한다.
 */
export const LOGO_STAR_GRID = { x: 114.384, y: 148.744 }

/** 타이틀 로고의 워드마크. 간판(71.649px)보다 크다. */
export const LOGO_WORDMARK_FONT_SIZE = 117.147

/**
 * 도트 판. 이미지로 두지 않고 CSS 로 그린다 —
 * 규칙적인 무늬라 그림이 필요 없고, 두 장이면 디코딩만 5.3MB 를 먹는다.
 *
 * 값은 전부 **화면 렌더에서 직접 잰 것**이다. 그림 파일 기준으로 계산하면 마스크와 회전이
 * 끼어 맞지 않는다 — 흰 면은 노드 박스보다 작고(마스크가 잘라낸다), 원본 그림은 90도
 * 눕혀 들어가 가로·세로 간격이 뒤바뀐다.
 *
 * 점은 지름 9~10px 원이고 한 행 안에서 `cell` 간격,
 * 행은 `cell` 의 **절반**마다 반 칸씩 엇갈린다. `offset` 은 첫 점 위치를 맞춘 위상이다.
 */
export interface DotPanel {
  readonly box: { readonly left: number; readonly top: number; readonly width: number; readonly height: number }
  readonly cell: number
  readonly radius: number
  readonly offsetX: number
  readonly offsetY: number
}

export const DOT_PANELS: Record<'top' | 'bottom', DotPanel> = {
  top: {
    box: { left: 103.5, top: 353, width: 868, height: 457 },
    cell: 53.9,
    radius: 4.4,
    offsetX: 32.35,
    offsetY: -17.75,
  },
  bottom: {
    box: { left: 103.5, top: 1237, width: 868, height: 416 },
    cell: 50,
    radius: 4.4,
    offsetX: 11.3,
    offsetY: -15.9,
  },
}

/** START! 버튼 안쪽 면. 바깥 판 기준 상대 위치다. */
export const START_INNER = { left: 6.92, top: 3.577, width: 720.766, height: 75.833 }

/**
 * 케이크 카드. 디자이너 메모: "케이크가 둥둥 떠다니면".
 *
 * 이름표·점수 라벨은 카드에 붙은 것이라 **한 덩어리**로 둔다 —
 * 따로 두면 카드만 떠다니고 라벨은 제자리에 남아 어긋난다.
 * 체리 한 알(`cherry-deco`)도 체리 케이크에 딸린 조각이라 같은 카드에 넣는다.
 * 겹침 순서가 곧 배열 순서다.
 *
 * 카드마다 리듬이 다르다. 떠다니는 값은 `components/motion/variants.ts` 의 `CARD_FLOAT` 에 있다.
 *
 * `nudge` 는 내보내기 바운딩 보정이다. Figma 는 노드 박스가 아니라 **그림자까지 포함한
 * 렌더 바운딩**으로 내보내는데, 회전된 카드마다 그림자 방향이 달라 확장이 비대칭이다.
 * 그래서 중심을 맞추는 것만으로는 어긋난다 — 원본 렌더와 픽셀 정합으로 실측한 값이다.
 * **에셋을 다시 받으면 이 값도 다시 재야 한다.**
 *
 * 라벨 바탕은 cream 에 cocoa 테두리(0.675px)라 div 로 그리고 글자만 SVG 로 얹는다.
 * 테두리는 내보낸 그림에 담기지 않아 놓치기 쉽다 — Figma 의 stroke 는 export 에서 빠진다.
 * `cherrychoco` 만 불투명이고 나머지는 70% 다. 하나만 보고 전체를 판단하면 안 된다.
 * `score` 만 텍스트 노드라 SVG 가 없어 비트맵을 쓴다.
 */
export interface TitleCardPart {
  readonly key: string
  readonly box: MetaBox
  readonly nudge?: { readonly x: number; readonly y: number }
}

export interface TitleCardLabel {
  readonly key: string
  readonly opacity: number
  readonly plate: MetaBox
  readonly text: MetaBox
}

export interface TitleCard {
  readonly key: CardKey
  readonly parts: readonly TitleCardPart[]
  readonly labels: readonly TitleCardLabel[]
}

export const TITLE_CARDS: readonly TitleCard[] = [
  {
    key: 'strawberry',
    parts: [
      { key: 'strawberry', box: { x: 1552.351, y: 41.997, width: 427.895, height: 408.41 }, nudge: { x: 0, y: 9 } },
    ],
    labels: [
      {
        key: 'strawberry',
        opacity: 0.7,
        plate: { x: 1224.109, y: 184.191, width: 150.668, height: 40.589 },
        text: { x: 1212.157, y: 195.289, width: 128.469, height: 16.689 },
      },
      {
        key: 'score',
        opacity: 0.7,
        plate: { x: 1184.117, y: 259.16, width: 108.859, height: 40.589 },
        text: { x: 1173.277, y: 270.043, width: 87, height: 19 },
      },
    ],
  },
  {
    key: 'chocoberry',
    parts: [
      { key: 'chocoberry', box: { x: 1551.777, y: 727.766, width: 415.242, height: 397.276 }, nudge: { x: -70, y: 9 } },
    ],
    labels: [
      {
        key: 'chocoberry',
        opacity: 0.7,
        plate: { x: 1175.445, y: 742.121, width: 179.788, height: 40.589 },
        text: { x: 1163.597, y: 761.378, width: 139.979, height: 16.894 },
      },
    ],
  },
  {
    key: 'cherry',
    parts: [
      { key: 'cherry-deco', box: { x: 1526.869, y: 538.027, width: 199.888, height: 248.861 }, nudge: { x: 0, y: -1 } },
      { key: 'cherry', box: { x: 1424.461, y: 371, width: 372.92, height: 318.554 }, nudge: { x: 6, y: 6 } },
    ],
    labels: [
      {
        key: 'cherrychoco',
        opacity: 1,
        plate: { x: 1494.146, y: 488.043, width: 189.214, height: 40.589 },
        text: { x: 1483.462, y: 508.509, width: 148.289, height: 19.237 },
      },
    ],
  },
  {
    key: 'kiwimango',
    parts: [
      { key: 'kiwimango', box: { x: 623.668, y: 639.511, width: 393.083, height: 376.864 } },
    ],
    labels: [
      {
        key: 'kiwimango',
        opacity: 0.7,
        plate: { x: 647.99, y: 751.248, width: 163.257, height: 40.589 },
        text: { x: 634.153, y: 763.568, width: 137.804, height: 16.003 },
      },
    ],
  },
  {
    key: 'heartchoco',
    parts: [
      { key: 'heartchoco', box: { x: 592.086, y: 55.082, width: 357.697, height: 367.558 }, nudge: { x: 5, y: -38 } },
    ],
    labels: [
      {
        key: 'heartchoco',
        opacity: 0.7,
        plate: { x: 609.402, y: 30, width: 167.308, height: 40.589 },
        text: { x: 597.115, y: 43.286, width: 140.725, height: 16.574 },
      },
    ],
  },
  {
    key: 'angelroll',
    parts: [
      { key: 'angelroll', box: { x: 588.398, y: 399.371, width: 356.337, height: 336.557 }, nudge: { x: -24, y: 11 } },
    ],
    labels: [
      {
        key: 'angelroll',
        opacity: 0.7,
        plate: { x: 279.564, y: 590.767, width: 150.668, height: 40.589 },
        text: { x: 267.612, y: 604.52, width: 122.118, height: 16.33 },
      },
    ],
  },
]

/**
 * 보드 위 줄무늬 장식. 이름은 `roll-vector` 지만 케이크가 아니라 **배경 그래픽**이라
 * 둥둥 띄우지 않는다 — 디자이너 메모의 "케이크가 둥둥"은 카드에만 해당한다.
 */
export const TITLE_STRIPES = { x: 660.13, y: 165.432, width: 737.274, height: 393.103 } satisfies MetaBox

export interface TitleDeco {
  readonly id: string
  readonly src: string
  readonly box: MetaBox
  /** 좌우 반전해서 쓰는 자리 */
  readonly flipX?: boolean
}

/** 하트·별 장식. 같은 그림이 여러 번 쓰여 파일 하나를 위치만 바꿔 반복한다. */
export const TITLE_DECOS: readonly TitleDeco[] = [
  { id: 'heart-right', src: 'heart', box: { x: 1219.972, y: 809.75, width: 44.527, height: 44.527 } },
  { id: 'heart-left-a', src: 'heart', box: { x: 641.035, y: 184.014, width: 44.527, height: 44.527 } },
  { id: 'heart-left-b', src: 'heart', box: { x: 615.896, y: 226.708, width: 44.527, height: 44.527 } },
  { id: 'plus-lg', src: 'plus-lg', box: { x: 620.904, y: 651.902, width: 67.421, height: 34.112 } },
  { id: 'plus-md', src: 'plus-md', box: { x: 584.677, y: 656.511, width: 58.21, height: 29.484 } },
  { id: 'plus-sm', src: 'plus-sm', box: { x: 551.135, y: 665.975, width: 39.521, height: 19.993 } },
  { id: 'ribbon-a', src: 'ribbon-a', box: { x: 534.528, y: 699.332, width: 80.452, height: 88.21 } },
  // 같은 그림이 좌우로 뒤집혀 한 번 더 쓰인다. 파일은 하나만 둔다.
  { id: 'ribbon-b', src: 'ribbon-a', box: { x: 548.502, y: 430.472, width: 72.381, height: 83.237 }, flipX: true },
]

export const SHOP_BACKGROUND = '/img/opening/shop-closed.avif'
export const DOOR_OPEN_PATCH = '/img/opening/door-open.avif'

/**
 * 문 패치 위치. 화면 좌표라 회전 변환을 거치지 않는다 — Figma 노드가 아니라 만든 에셋이다.
 *
 * Figma 는 문 닫힘/열림을 배경 두 장으로 그렸는데 두 장이 **같은 그림이 아니다**.
 * 컷 3 이 세로로 2% 크고(1920 기준 위 17px·아래 13px) 원본 비율도 다르다(810×1440 / 816×1456).
 * 그대로 교차하면 문이 열리는 게 아니라 화면 전체가 흔들린다.
 * 그래서 컷 3 을 컷 2 좌표계로 정렬한 뒤 문 영역만 잘라 가장자리를 알파 페이드했다.
 * 디자이너가 같은 캔버스에서 문 레이어만 바꿔 다시 내보내면 이 패치는 필요 없다.
 */
export const DOOR_PATCH_BOX = { left: 82.5, top: 825, width: 420, height: 810 }

export interface OpeningCut {
  readonly id: string
  /** 배경 이미지가 뜨기 전의 바탕색. Figma 프레임 배경색이다. */
  readonly canvasColor: string
  readonly backgroundOpacity: number
  readonly doorOpen: boolean
  readonly lines: readonly string[]
  readonly hint: string
}

export const OPENING_CUTS = [
  {
    id: 'shop-front',
    canvasColor: '#c8a7a1',
    backgroundOpacity: 1,
    doorOpen: false,
    lines: ['어? 여기 새로 생긴 디저트 가게인가?', '맛있어 보인다. 한 번 들어가 볼까?'],
    hint: '화면을 터치해 들어가기',
  },
  {
    id: 'shop-door-open',
    canvasColor: '#fff9f1',
    // 문만 열린 컷이다. 배경을 흐리면 색감이 연해져 같은 가게로 보이지 않는다.
    backgroundOpacity: 1,
    doorOpen: true,
    lines: ['어? 여기 새로 생긴 디저트 가게인가?', '맛있어 보인다. 한 번 들어가 볼까?'],
    hint: '화면을 터치해 들어가기',
  },
] as const satisfies readonly OpeningCut[]

/* ------------------------------------------------------------------ 컷 4~8 매장 안 */

/**
 * 매장 배경 두 장. 컷 4·8 은 진열장 앞, 컷 5~7 은 작업대 앞이다.
 *
 * 배경만 **출력 픽셀(1440×2560)** 로 뽑는다. 화면을 꽉 채우므로 2x 로 두면 한 장에
 * 디코딩 33MB 를 쓴다 (`.claude/rules/assets.md`). 나머지 조각은 `ASSET_SCALE` 이
 * 전제하는 2x 그대로다.
 */
export const INTERIOR_BACKGROUNDS = {
  case: '/img/opening/interior/case.avif',
  counter: '/img/opening/interior/counter.avif',
} as const

export type InteriorBackground = keyof typeof INTERIOR_BACKGROUNDS

/** Figma 오프닝 프레임의 배경색. 배경 그림이 뜨기 전 한 프레임만 보인다. */
export const INTERIOR_CANVAS_COLOR = '#ffeff3'

/**
 * 제빵사. 컷마다 표정과 크기가 달라 그림이 따로다. 컷 4 와 8 이 같은 그림을 쓴다.
 * Figma 노드 이름은 셋 다 `IMG_1354 2` 라 이름으로 구분할 수 없다 — 크기로 갈린다.
 */
export const BAKER_POSES = {
  ask: { src: '/img/opening/interior/baker-ask.avif', box: { x: 960, y: 249, width: 601, height: 663 } },
  smile: { src: '/img/opening/interior/baker-smile.avif', box: { x: 896, y: 371, width: 668, height: 715 } },
  grin: { src: '/img/opening/interior/baker-grin.avif', box: { x: 896, y: 379, width: 660, height: 706 } },
} as const satisfies Record<string, { src: string; box: MetaBox }>

export type BakerPose = keyof typeof BAKER_POSES

/**
 * 케이크에 붙은 별.
 *
 * 별 노드는 아트보드 90도 위에 **자기 회전이 한 번 더** 걸려 있다. 그래서 메타데이터 박스가
 * 회전 후 바운딩이고 `fromArtboardMeta()` 를 그대로 태우면 자리가 밀린다 —
 * 가장 큰 별이 가로로 40px 어긋났다.
 *
 * 그래서 **중심은 1080×1920 레퍼런스 렌더에서 픽셀로 직접 측정**했고,
 * 크기는 내보낸 SVG 의 원래 크기, 기울기는 Figma 회전값에서 아트보드 90도를 뺀 값이다.
 * 디자인이 바뀌면 이 셋을 같이 다시 잰다.
 */
export interface CakeStar {
  readonly src: string
  readonly center: { readonly x: number; readonly y: number }
  readonly width: number
  readonly height: number
  readonly tiltDeg: number
}

const STAR = '/img/opening/interior/star.svg'
const STAR_DECO = '/img/opening/interior/star-deco.svg'

export interface CakeSlice {
  readonly key: string
  readonly box: MetaBox
  /**
   * 화면 렌더에 맞춘 보정(px).
   *
   * 케이크 노드도 별과 같은 문제를 갖는다 — 아트보드 90도 위에 자기 회전이 한 번 더
   * 걸려 있어 메타데이터 좌표가 회전 후 바운딩의 모서리가 아니다. 가장 큰 것이 119px
   * 어긋났다. 그래서 내보낸 그림을 1080×1920 레퍼런스 렌더에 겹쳐 맞춰 잰 값이다.
   * 회전이 없는 제빵사는 보정이 0 이라 `BAKER_POSES` 에는 이 칸이 없다.
   */
  readonly nudge?: { readonly x: number; readonly y: number }
  readonly stars?: readonly CakeStar[]
}

/**
 * 컷 6·7 바닥에 깔리는 케이크 조각. 겹침 순서가 곧 배열 순서다.
 *
 * **키는 컷 1 의 `TITLE_CARDS` 와 같은 여섯 개다.** 같은 케이크를 두 컷이 각자의 각도로
 * 내보낸 것이라 파일은 둘이지만 이름은 하나여야 한다 — 어휘가 갈리면 같은 케이크를
 * 두 이름으로 부르게 되고, 디자인이 바뀔 때 한쪽만 고치게 된다.
 * `cake-chocoberry` 와 `slice-chocoberry` 는 각도까지 같아 사실상 같은 파일이다.
 *
 * **컷 6 좌표를 컷 7 에도 그대로 쓴다.** 두 컷은 대사와 표정만 다른 같은 장면인데
 * Figma 에서는 롤케이크가 29px 내려가 있고 별 3개가 다른 케이크로 옮겨가 있다.
 * 같은 장면에서 한 조각만 움직이면 고장으로 읽히므로 디자인 정리 전까지 컷 6 을 기준으로 둔다.
 */
export const CAKE_SLICES: readonly CakeSlice[] = [
  {
    key: 'strawberry',
    nudge: { x: -52, y: 10 },
    box: { x: 617.1309902136294, y: 76.58229629057267, width: 336.8093447347419, height: 330.52012807763094 },
    stars: [
      { src: STAR, center: { x: 224.5, y: 1475 }, width: 30.6298, height: 29.1322, tiltDeg: 11.34 },
      { src: STAR, center: { x: 259, y: 1481 }, width: 30.6298, height: 29.1322, tiltDeg: 11.34 },
      { src: STAR_DECO, center: { x: 355, y: 1452 }, width: 58.1668, height: 55.3229, tiltDeg: 39.32 },
    ],
  },
  {
    key: 'cherry',
    nudge: { x: 10, y: -114 },
    box: { x: 875.200927734375, y: -1, width: 430.93461190248854, height: 401.2507967942365 },
  },
  {
    key: 'heartchoco',
    nudge: { x: -119, y: 11 },
    box: { x: 1539, y: 539.568359375, width: 391.2757797293798, height: 396.804154596899 },
  },
  {
    key: 'kiwimango',
    nudge: { x: 6, y: -37 },
    box: { x: 1427.961669921875, y: 27.138671875, width: 370.2376490215065, height: 354.96156145378336 },
    stars: [
      { src: STAR, center: { x: 111.5, y: 624.5 }, width: 28.3837, height: 26.9945, tiltDeg: -8.96 },
      { src: STAR, center: { x: 144, y: 619.5 }, width: 28.3837, height: 26.9945, tiltDeg: -8.96 },
    ],
  },
  {
    key: 'angelroll',
    nudge: { x: 7, y: -70 },
    box: { x: 1216.62353515625, y: 638, width: 325.3681756802471, height: 314.07916729810677 },
  },
  {
    key: 'chocoberry',
    nudge: { x: -58, y: 11 },
    box: { x: 1245, y: 337.44140625, width: 365.17303323068336, height: 349.3732863842415 },
  },
]

/**
 * 선택지 버튼 두 칸. 컷 4 와 8 이 같은 자리를 쓴다.
 * 크기는 `ChoiceButton` 이 갖고 있으므로 여기서는 자리만 준다.
 */
export const CHOICE_SLOTS = [
  { left: 62, top: 1559.4146423339844 },
  { left: 62, top: 1723.6270446777344 },
] as const

/** 컷 8 에서 갈리는 두 갈래. STEP.1 이 이 값으로 분기한다. */
export type OpeningExit = 'for-someone' | 'design-myself'

export type InteriorCutId = 'welcome' | 'intro' | 'showcase' | 'promise' | 'start'

export interface InteriorChoice {
  readonly label: string
  readonly variant: ChoiceVariant
  /** 이 선택지가 여는 컷. 오프닝을 끝내는 선택지는 대신 `exit` 를 갖는다. */
  readonly next?: InteriorCutId
  readonly exit?: OpeningExit
}

export interface InteriorCut {
  readonly id: InteriorCutId
  readonly background: InteriorBackground
  readonly baker: BakerPose | null
  readonly slices: boolean
  readonly lines: readonly string[]
  /** 탭으로 넘어가는 컷. 선택지가 있는 컷에는 없다. */
  readonly next?: InteriorCutId
  /** 대사가 다 나오면 탭 없이 넘어간다. */
  readonly autoAdvance?: boolean
  readonly hint?: string
  readonly choices?: readonly InteriorChoice[]
}

/**
 * 컷 5 와 6 은 **대사가 완전히 같고** 컷 6 에만 케이크와 제빵사가 더 있다.
 * 그래서 둘 사이는 탭이 아니라 자동으로 넘긴다 — 같은 말을 보며 한 번 더 누르게 하면
 * 화면이 멈춘 것처럼 읽힌다. 케이크가 등장하는 것이 이 전환의 내용이다.
 */
export const INTERIOR_CUTS = [
  {
    id: 'welcome',
    background: 'case',
    baker: 'ask',
    slices: false,
    lines: ['어서 오세요! “ HWIPP BAKERY ” 입니다 ♥', '예약하신 분이신가요?'],
    choices: [
      { label: '아니요. 예약 안 했어요.', variant: 'blush', next: 'start' },
      { label: '여기는 뭐하는 곳이에요?', variant: 'mint', next: 'intro' },
    ],
  },
  {
    id: 'intro',
    background: 'counter',
    baker: null,
    slices: false,
    lines: ['아하! 저희는 세상에 단 하나뿐인', '특별한 맞춤 케이크를 구워드리는 곳이에요!'],
    next: 'showcase',
    autoAdvance: true,
  },
  {
    id: 'showcase',
    background: 'counter',
    baker: 'smile',
    slices: true,
    lines: ['아하! 저희는 세상에 단 하나뿐인', '특별한 맞춤 케이크를 구워드리는 곳이에요!'],
    next: 'promise',
    hint: '화면을 터치해 계속하기',
  },
  {
    id: 'promise',
    background: 'counter',
    baker: 'grin',
    slices: true,
    lines: ['두 사람의 이야기와 추억을 들려주시면,', '제가, 딱 맞는 디자인과 맛을 레시피로 만들어 드려요!'],
    next: 'start',
    hint: '화면을 터치해 계속하기',
  },
  {
    id: 'start',
    background: 'case',
    baker: 'ask',
    slices: false,
    lines: ['자, 그럼 바로 시작해 볼까요?', '오늘 어떤 분을 위한 케이크를 구워드릴까요?'],
    choices: [
      { label: '좋아! 내가 선물하고 싶은 상대는 ...', variant: 'blush', exit: 'for-someone' },
      { label: '내가 바로 직접 디자인 해볼래', variant: 'mint', exit: 'design-myself' },
    ],
  },
] as const satisfies readonly InteriorCut[]
