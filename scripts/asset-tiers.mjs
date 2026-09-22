/**
 * 에셋 계층 규칙과 예산. **사람이 관리하는 유일한 목록**이고 나머지는 스캔으로 만든다
 * (`.claude/rules/assets.md`).
 *
 * 런타임이 아니라 스크립트 쪽에 둔다 — 프리로더는 매니페스트에 박힌 계층 값만 읽으면 되고,
 * 규칙을 런타임 번들에 넣을 이유가 없다. 계층의 의미는 `lib/assets/tiers.ts` 에 적었다.
 */

/**
 * 위에서부터 먼저 맞는 규칙을 쓴다. 어느 규칙에도 걸리지 않는 에셋이 있으면
 * **매니페스트 생성이 실패한다** — 계층이 선언되지 않은 에셋이 조용히 섞이면
 * 예산 계산이 틀리고, 그 사실은 전시 중에 드러난다.
 */
export const TIER_RULES = [
  { prefix: 'img/opening/', tier: 'hot', why: '오프닝은 부팅 직후 바로 이어서 나온다' },
  { prefix: 'img/dialog/', tier: 'hot', why: '대화 박스는 모든 STEP 에 나온다' },
  { prefix: 'img/ui/', tier: 'hot', why: '공통 UI' },
  { prefix: 'lottie/', tier: 'hot', why: '연출 Lottie' },
]

export const tierOf = (path) => TIER_RULES.find((rule) => path.startsWith(rule.prefix))?.tier ?? null

/**
 * 예산 (`.claude/rules/assets.md`). 넘으면 빌드를 실패시킨다. 코드로 우회하지 않는다 —
 * 디자인 단계에서 해결할 문제다.
 *
 * 디코딩 예산은 파일 크기가 아니라 **픽셀 총량 × 4바이트**다. 500KB 짜리 파일도 화면에
 * 떠 있는 동안에는 픽셀 수만큼 RAM 을 쓴다. 풀스크린 1장이 약 14MB 이므로 hot 계층은
 * 사실상 20장 남짓이 상한이다.
 */
export const ASSET_BUDGET = {
  /** 동시 상주 디코딩 — hot 계층 합계 */
  hotDecodeBytes: 300 * 1024 * 1024,
  /** 파일 총합 */
  fileBytes: 300 * 1024 * 1024,
  /** Lottie 파일 총합 */
  lottieBytes: 20 * 1024 * 1024,
}

export const BYTES_PER_PIXEL = 4
