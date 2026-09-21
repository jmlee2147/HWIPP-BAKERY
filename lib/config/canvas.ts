/** 고정 캔버스 설계값. `.claude/rules/architecture.md` */
export const CANVAS_WIDTH = 1080
export const CANVAS_HEIGHT = 1920

/** 캔버스를 뷰포트에 맞추는 배율. 두 축 중 작은 값 — 주소창이 세로를 깎아도 가로가 넘치지 않게. */
export function getCanvasScale(viewportWidth: number, viewportHeight: number): number {
  return Math.min(viewportWidth / CANVAS_WIDTH, viewportHeight / CANVAS_HEIGHT)
}
