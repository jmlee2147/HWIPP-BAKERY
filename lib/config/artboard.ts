import { CANVAS_HEIGHT } from './canvas'

/** Figma 오프닝 아트보드의 회전 좌표계 박스. 실측값을 그대로 적는다. */
export interface RotatedBox {
  left: number
  top: number
  width: number
  height: number
}

export interface ScreenBox {
  left: number
  top: number
  width: number
  height: number
}

/**
 * 오프닝 아트보드는 세로 화면을 90도 눕혀 1920×1080 좌표계에 그려져 있다.
 * 손으로 환산하지 않도록 변환을 여기 한곳에 둔다. 근거는 `docs/decisions/002-rotated-artboard.md`.
 */
export function fromRotatedArtboard({ left, top, width, height }: RotatedBox): ScreenBox {
  return {
    left: top,
    top: CANVAS_HEIGHT - left - width,
    width: height,
    height: width,
  }
}

/** 회전 좌표계에서 잰 오프셋 벡터(그림자 등)를 화면 방향으로 돌린다. */
export function rotateOffset(x: number, y: number): { x: number; y: number } {
  return { x: -y, y: x }
}

/** Figma `get_metadata` 가 주는 박스. width·height 는 이미 화면 기준이다. */
export interface MetaBox {
  x: number
  y: number
  width: number
  height: number
}

/**
 * `get_metadata` 좌표를 화면 좌표로 옮긴다.
 *
 * 메타데이터는 회전 후 크기를 주면서 위치만 회전 좌표계로 준다 —
 * `x` 는 회전 좌표계의 left+width 에 해당한다. 요소가 수십 개인 화면에서는
 * 노드마다 design context 를 뜨는 것보다 이쪽이 훨씬 싸다.
 */
export function fromArtboardMeta({ x, y, width, height }: MetaBox): ScreenBox {
  return { left: y, top: CANVAS_HEIGHT - x, width, height }
}

/**
 * 여러 박스를 감싸는 최소 박스.
 *
 * 카드처럼 여러 조각이 한 덩어리로 움직일 때 `transform` 의 기준 상자가 된다 —
 * 조각마다 따로 변형하면 원점이 달라 그룹이 흩어진다.
 *
 * 빈 배열은 던진다. 조용히 넘기면 `-Infinity` 크기의 박스가 나와 그 그룹이 화면에서
 * 소리 없이 사라진다 — 전시 중에는 원인을 찾을 수 없다 (`.claude/rules/operations.md`).
 */
export function unionBox(boxes: readonly ScreenBox[]): ScreenBox {
  if (boxes.length === 0) throw new Error('unionBox: 감쌀 박스가 없다')

  const left = Math.min(...boxes.map((box) => box.left))
  const top = Math.min(...boxes.map((box) => box.top))
  const right = Math.max(...boxes.map((box) => box.left + box.width))
  const bottom = Math.max(...boxes.map((box) => box.top + box.height))

  return { left, top, width: right - left, height: bottom - top }
}
