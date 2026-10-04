// 로딩 화면에 보여 줄 진행률(0~100의 정수). 처음에는 빠르게 오르고 끝으로 갈수록 느려진다.
export function loadingPercent(elapsedMs: number, durationMs: number): number {
  if (durationMs <= 0 || elapsedMs >= durationMs) return 100;
  const remaining = 1 - Math.max(elapsedMs, 0) / durationMs;
  return Math.floor((1 - remaining * remaining) * 100);
}
