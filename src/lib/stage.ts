export const STAGE_WIDTH = 1080;
export const STAGE_HEIGHT = 1920;

// 화면은 1080x1920 고정이다. 뷰포트가 어떤 크기든 비율을 유지한 채 안쪽에 맞춘다.
export function computeStageScale(
  viewportWidth: number,
  viewportHeight: number,
): number {
  if (viewportWidth <= 0 || viewportHeight <= 0) return 0;
  return Math.min(viewportWidth / STAGE_WIDTH, viewportHeight / STAGE_HEIGHT);
}
