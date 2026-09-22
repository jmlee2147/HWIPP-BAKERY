/**
 * 모션 값의 단일 출처. 컴포넌트에 직접 쓰지 않는다 (`.claude/rules/motion.md`).
 * duration·easing 토큰은 `app/globals.css` 의 CSS 변수에 있다.
 */

/** 대사 한 글자당 간격. */
export const TYPE_CHAR_MS = 50

/** 대화 박스가 떠오른 뒤 타이핑이 시작된다. */
export const TYPE_START_DELAY_MS = 700

/** 주어진 글자 수의 타이핑이 끝나는 시각. */
export const typeDurationMs = (charCount: number) =>
  TYPE_START_DELAY_MS + charCount * TYPE_CHAR_MS

/**
 * 컷 1 케이크 카드가 떠다니는 리듬.
 *
 * 카드마다 주기·진폭·기울기를 모두 다르게 둔다 — 주기가 같으면 시작을 어긋나게 해도
 * 결국 한 덩어리로 흔들려 보인다. `alternate` 왕복이라 실제 한 바퀴는 duration 의 두 배다.
 * 키는 `features/opening/script.ts` 의 `TITLE_CARDS` 와 같다.
 */
export interface CardFloat {
  readonly durationMs: number
  readonly delayMs: number
  /** 위로 떠오르는 거리(px). 음수가 위쪽이다. */
  readonly riseY: number
  /** 좌우로 흐르는 거리(px). */
  readonly driftX: number
  readonly tiltDeg: number
}

export const CARD_FLOAT = {
  strawberry: { durationMs: 2400, delayMs: 0, riseY: -18, driftX: 6, tiltDeg: 1.6 },
  chocoberry: { durationMs: 2800, delayMs: 380, riseY: -14, driftX: -7, tiltDeg: -1.8 },
  cherry: { durationMs: 2150, delayMs: 760, riseY: -20, driftX: 5, tiltDeg: 2.2 },
  kiwimango: { durationMs: 2650, delayMs: 200, riseY: -16, driftX: -6, tiltDeg: -1.5 },
  heartchoco: { durationMs: 2300, delayMs: 560, riseY: -13, driftX: 8, tiltDeg: 1.9 },
  angelroll: { durationMs: 2950, delayMs: 940, riseY: -19, driftX: -5, tiltDeg: -2.1 },
} as const satisfies Record<string, CardFloat>

/** 카드 키는 모션 테이블이 정한다 — 리듬 없는 카드가 생기지 않게 타입으로 묶는다. */
export type CardKey = keyof typeof CARD_FLOAT

/**
 * 전환이 끝났다는 신호(`animationend`)가 오지 않을 때의 안전망(ms).
 *
 * 정확한 시간이 아니라 **넉넉한 상한**이다 — 전환 길이(`--dur-slow` 700ms)보다 길기만 하면 된다.
 * 이 장치가 없으면 두 컷이 모두 입력이 막힌 채로 남아 탭으로도 복구할 수 없다
 * (`.claude/rules/operations.md` — 절차가 아니라 설계로 푼다).
 */
export const CUT_TRANSITION_FALLBACK_MS = 1500

/** 컷 1 진입 — 카드가 차례로 튀어 들어온다. */
export const CARD_POP_DELAY_MS = 160
export const CARD_POP_STEP_MS = 90

/** 카드가 다 들어온 뒤 로고·집게가 떨어지고 마지막에 START! 가 올라온다. */
export const LOGO_DROP_DELAY_MS = 820
export const CLIP_DROP_DELAY_MS = 980
export const START_POP_DELAY_MS = 1320

/**
 * 하트·플러스·리본 장식이 차례로 반짝인다.
 *
 * 위상은 고정 간격이 아니라 **주기를 개수로 나눠** 잡는다 — 간격을 상수로 두면
 * `간격 × 개수` 가 주기를 넘는 순간 위상이 되감겨 두 장식이 같이 튄다.
 * 실제로 420ms × 8개로 두었을 때 80ms 차로 붙는 쌍이 둘 생겼다.
 */
export const DECO_TWINKLE_MS = 2600

export const decoTwinkleDelayMs = (index: number, count: number) =>
  (index * DECO_TWINKLE_MS) / count

/**
 * 로고 뒤 별판이 흐르는 속도(px/s)와 방향.
 *
 * 디자이너 메모의 "마우스 갖다대면 별 무빙"을 터치로 옮긴 것이다 — 실기에 커서가 없다
 * (`.claude/rules/project-constraints.md`). 왕복시키지 않고 **누른 쪽으로 계속 흘린다**.
 * 되감기는 `useStarFlow` 가 별 격자 주기로 처리하므로 이음새가 보이지 않는다.
 */
export const STAR_FLOW_SPEED_PX = 26

/** 아무도 누르지 않았을 때 흐르는 방향. 왼쪽 위 대각선. */
export const STAR_FLOW_HEADING = { x: -0.74, y: -0.67 }

/** 방향이 꺾이는 속도(1/s). 클수록 빨리 돌아선다. 3 이면 0.3 초쯤에 새 방향을 잡는다. */
export const STAR_FLOW_TURN_RATE = 3

/**
 * 이만큼 움직여야 방향을 다시 잡는다(px).
 *
 * 포인터가 멈춘 뒤에도 좌표가 1px 씩 떨리면 방향이 계속 흔들린다.
 * 멈추면 마지막 방향 그대로 흐르는 것이 이 연출의 규칙이다.
 */
export const STAR_STEER_MIN_PX = 2

/**
 * 케이크를 눌렀을 때. 말랑하게 한 번 부풀었다 가라앉는다.
 *
 * 눌림(squash)을 먼저 넣으면 방향이 두 번 꺾여 움찔거리고, 그게 고장처럼 보인다.
 * 그래서 한 방향으로 부풀렸다 되돌리기만 한다 — 커지는 구간은 손가락에 바로 붙도록
 * 빠르게(`--ease-enter`), 가라앉는 구간은 길게(`--ease-move`) 간다.
 * 이징은 `app/globals.css` 에서 읽어 쓴다 — 값을 두 곳에 두지 않는다.
 */
export const CARD_TAP = {
  durationMs: 440,
  popScale: 1.06,
  tiltDeg: 1.6,
  /** 가장 부푼 시점. 앞쪽에 둘수록 반응이 빨라 보인다. 0.22 면 100ms 안에 최대가 된다. */
  peakOffset: 0.22,
} as const

/**
 * 컷 6 케이크 조각이 한 장씩 들어온다. 컷 1 카드와 리듬을 맞췄지만 값은 따로 둔다 —
 * 두 장면이 서로의 타이밍에 묶이면 한쪽을 못 고친다.
 */
export const SLICE_POP_STEP_MS = 90

/** 컷 5 대사가 끝나고 케이크가 등장하기까지. 읽을 틈을 한 박자 준다. */
export const SHOWCASE_DELAY_MS = 600

/** 컷 4·8 선택지 두 칸이 차례로 올라온다. */
export const CHOICE_IN_STEP_MS = 90
