import type { CardKey } from '@/components/motion/variants'
import type { MetaBox, RotatedBox } from '@/lib/config/artboard'

/**
 * 오프닝 내러티브. Figma `전시 디자인 공유 / 오프닝` 섹션.
 *
 * 전체 8컷 중 이 파일은 2~3번을 담는다. 1번(타이틀)과 4~8번은 아직 없다.
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
