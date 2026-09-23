/**
 * 이 파일은 `pnpm build:manifest` 가 만든다. **직접 고치지 않는다.**
 * 에셋을 추가·변경했으면 스크립트를 다시 돌린다. 계층 규칙은 `scripts/asset-tiers.mjs` 에 있다.
 *
 * `pixels` 는 원본 픽셀 수다. 디코딩 메모리는 여기에 4바이트를 곱한 값으로 본다 —
 * 브라우저는 압축률과 무관하게 비트맵을 들고 있는다 (`.claude/rules/assets.md`).
 * SVG 는 표시 크기에 따라 래스터가 달라져 `pixels` 를 0 으로 둔다. 라벨·장식뿐이라
 * 비트맵이 예산을 지배한다.
 */
import type { AssetTier } from './tiers'

export interface AssetEntry {
  readonly path: string
  readonly tier: AssetTier
  /** 파일 크기(바이트) */
  readonly bytes: number
  /** 원본 픽셀 수. SVG 는 0 */
  readonly pixels: number
}

export const ASSET_MANIFEST: readonly AssetEntry[] = [
  { path: '/img/dialog/cream.svg', tier: 'hot', bytes: 1849, pixels: 0 },
  { path: '/img/dialog/dots.svg', tier: 'hot', bytes: 7918, pixels: 0 },
  { path: '/img/dialog/star.svg', tier: 'hot', bytes: 389, pixels: 0 },
  { path: '/img/dialog/top-edge.svg', tier: 'hot', bytes: 5148, pixels: 0 },
  { path: '/img/opening/door-open.avif', tier: 'hot', bytes: 74473, pixels: 604800 },
  { path: '/img/opening/interior/baker-ask.avif', tier: 'hot', bytes: 44755, pixels: 1593852 },
  { path: '/img/opening/interior/baker-grin.avif', tier: 'hot', bytes: 48805, pixels: 1863840 },
  { path: '/img/opening/interior/baker-smile.avif', tier: 'hot', bytes: 48398, pixels: 1910480 },
  { path: '/img/opening/interior/case.avif', tier: 'hot', bytes: 159342, pixels: 3686400 },
  { path: '/img/opening/interior/counter.avif', tier: 'hot', bytes: 121981, pixels: 3686400 },
  { path: '/img/opening/interior/slice-angelroll.avif', tier: 'hot', bytes: 13019, pixels: 480128 },
  { path: '/img/opening/interior/slice-cherry.avif', tier: 'hot', bytes: 13967, pixels: 761600 },
  { path: '/img/opening/interior/slice-chocoberry.avif', tier: 'hot', bytes: 14148, pixels: 580388 },
  { path: '/img/opening/interior/slice-heartchoco.avif', tier: 'hot', bytes: 17298, pixels: 698860 },
  { path: '/img/opening/interior/slice-kiwimango.avif', tier: 'hot', bytes: 13270, pixels: 597304 },
  { path: '/img/opening/interior/slice-strawberry.avif', tier: 'hot', bytes: 11631, pixels: 511176 },
  { path: '/img/opening/interior/star-deco.svg', tier: 'hot', bytes: 335, pixels: 0 },
  { path: '/img/opening/interior/star.svg', tier: 'hot', bytes: 335, pixels: 0 },
  { path: '/img/opening/shop-closed.avif', tier: 'hot', bytes: 311345, pixels: 3686400 },
  { path: '/img/opening/sign-bakery.svg', tier: 'hot', bytes: 19340, pixels: 0 },
  { path: '/img/opening/sign-heart.svg', tier: 'hot', bytes: 4659, pixels: 0 },
  { path: '/img/opening/sign-plate.avif', tier: 'hot', bytes: 20640, pixels: 340032 },
  { path: '/img/opening/title/cake-angelroll.avif', tier: 'hot', bytes: 60245, pixels: 549442 },
  { path: '/img/opening/title/cake-cherry-deco.avif', tier: 'hot', bytes: 9031, pixels: 199200 },
  { path: '/img/opening/title/cake-cherry.avif', tier: 'hot', bytes: 60637, pixels: 537990 },
  { path: '/img/opening/title/cake-chocoberry.avif', tier: 'hot', bytes: 59002, pixels: 720680 },
  { path: '/img/opening/title/cake-heartchoco.avif', tier: 'hot', bytes: 65716, pixels: 591261 },
  { path: '/img/opening/title/cake-kiwimango.avif', tier: 'hot', bytes: 61086, pixels: 661510 },
  { path: '/img/opening/title/cake-strawberry.avif', tier: 'hot', bytes: 67806, pixels: 753375 },
  { path: '/img/opening/title/clip.avif', tier: 'hot', bytes: 12989, pixels: 422500 },
  { path: '/img/opening/title/deco-heart.avif', tier: 'hot', bytes: 3191, pixels: 8100 },
  { path: '/img/opening/title/deco-plus-lg.avif', tier: 'hot', bytes: 2607, pixels: 9315 },
  { path: '/img/opening/title/deco-plus-md.avif', tier: 'hot', bytes: 2747, pixels: 6903 },
  { path: '/img/opening/title/deco-plus-sm.avif', tier: 'hot', bytes: 2102, pixels: 3200 },
  { path: '/img/opening/title/deco-ribbon-a.avif', tier: 'hot', bytes: 11010, pixels: 35880 },
  { path: '/img/opening/title/label-angelroll.svg', tier: 'hot', bytes: 19104, pixels: 0 },
  { path: '/img/opening/title/label-cherrychoco.svg', tier: 'hot', bytes: 21625, pixels: 0 },
  { path: '/img/opening/title/label-chocoberry.svg', tier: 'hot', bytes: 13821, pixels: 0 },
  { path: '/img/opening/title/label-heartchoco.svg', tier: 'hot', bytes: 22195, pixels: 0 },
  { path: '/img/opening/title/label-kiwimango.svg', tier: 'hot', bytes: 12332, pixels: 0 },
  { path: '/img/opening/title/label-score.avif', tier: 'hot', bytes: 2884, pixels: 4930 },
  { path: '/img/opening/title/label-strawberry.svg', tier: 'hot', bytes: 21290, pixels: 0 },
  { path: '/img/opening/title/logo-plate.avif', tier: 'hot', bytes: 10860, pixels: 340032 },
  { path: '/img/opening/title/logo-small.avif', tier: 'hot', bytes: 24717, pixels: 72540 },
  { path: '/img/opening/title/logo-stars.avif', tier: 'hot', bytes: 38726, pixels: 622104 },
  { path: '/img/opening/title/stripes.png', tier: 'hot', bytes: 35147, pixels: 1160825 },
  { path: '/img/opening/title/topbar.avif', tier: 'hot', bytes: 8042, pixels: 313920 },
  { path: '/img/opening/title/wall.avif', tier: 'hot', bytes: 70331, pixels: 3392640 },
  { path: '/img/ui/arrow.svg', tier: 'hot', bytes: 455, pixels: 0 },
  { path: '/img/ui/progress-knob-done.svg', tier: 'hot', bytes: 586, pixels: 0 },
  { path: '/img/ui/progress-knob.svg', tier: 'hot', bytes: 601, pixels: 0 },
  { path: '/img/ui/progress-label-done.svg', tier: 'hot', bytes: 1531, pixels: 0 },
  { path: '/img/ui/progress-label.svg', tier: 'hot', bytes: 1540, pixels: 0 },
  { path: '/img/ui/star-small.svg', tier: 'hot', bytes: 825, pixels: 0 },
]

/** 픽셀 하나당 RGBA 4바이트. 압축률과 무관하다. */
export const BYTES_PER_PIXEL = 4

export const decodeBytesOf = (entry: AssetEntry) => entry.pixels * BYTES_PER_PIXEL
