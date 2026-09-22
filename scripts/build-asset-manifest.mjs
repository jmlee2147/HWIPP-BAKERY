/**
 * `public/` 을 스캔해 `lib/assets/manifest.ts` 를 만든다.
 *
 * 매니페스트를 수기로 관리하지 않는 이유는 하나다 — 사람이 목록을 유지하면 반드시 빠지고,
 * 빠진 것은 전시 중에 드러난다 (`.claude/rules/assets.md`).
 *
 * 생성물은 저장소에 커밋한다. Vercel 빌드에서 sharp 를 돌리지 않아도 되고,
 * `pnpm check:assets` 가 재생성 결과와 비교해 최신인지 검증한다.
 * 계층 규칙과 예산은 `scripts/asset-tiers.mjs` 에 있다.
 *
 * 실행: `pnpm build:manifest`
 */
import { readdir, stat, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { tierOf } from './asset-tiers.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PUBLIC_DIR = join(ROOT, 'public')
const OUT_FILE = join(ROOT, 'lib/assets/manifest.ts')

/** 프리로드 대상. 폰트는 CSS 가 로드하므로 여기 넣지 않는다. */
const SCAN_DIRS = ['img', 'lottie']

/** 비트맵만 디코딩 메모리를 계산한다. SVG 는 생성물 주석 참고. */
const BITMAP = /\.(avif|png|jpe?g|webp)$/i

const walk = async (dir) => {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    // 도구가 만든 디렉터리는 에셋이 아니다
    if (entry.name.startsWith('.')) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(path)))
    else out.push(path)
  }
  return out
}

const toPublicPath = (absolute) => relative(PUBLIC_DIR, absolute).split(sep).join('/')

async function collect() {
  const files = []
  for (const dir of SCAN_DIRS) files.push(...(await walk(join(PUBLIC_DIR, dir))))

  const entries = []
  const unclassified = []

  for (const absolute of files.sort()) {
    const path = toPublicPath(absolute)
    const tier = tierOf(path)
    if (!tier) {
      unclassified.push(path)
      continue
    }

    const { size } = await stat(absolute)
    let pixels = 0

    if (BITMAP.test(path)) {
      const { width, height } = await sharp(absolute).metadata()
      pixels = width * height
    }

    entries.push({ path: `/${path}`, tier, bytes: size, pixels })
  }

  if (unclassified.length > 0) {
    console.error('계층이 선언되지 않은 에셋이 있다. `scripts/asset-tiers.mjs` 에 규칙을 추가한다:')
    for (const path of unclassified) console.error(`  ${path}`)
    process.exit(1)
  }

  return entries
}

const render = (entries) => {
  const rows = entries
    .map((e) => `  { path: '${e.path}', tier: '${e.tier}', bytes: ${e.bytes}, pixels: ${e.pixels} },`)
    .join('\n')

  return `/**
 * 이 파일은 \`pnpm build:manifest\` 가 만든다. **직접 고치지 않는다.**
 * 에셋을 추가·변경했으면 스크립트를 다시 돌린다. 계층 규칙은 \`scripts/asset-tiers.mjs\` 에 있다.
 *
 * \`pixels\` 는 원본 픽셀 수다. 디코딩 메모리는 여기에 4바이트를 곱한 값으로 본다 —
 * 브라우저는 압축률과 무관하게 비트맵을 들고 있는다 (\`.claude/rules/assets.md\`).
 * SVG 는 표시 크기에 따라 래스터가 달라져 \`pixels\` 를 0 으로 둔다. 라벨·장식뿐이라
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
${rows}
]

/** 픽셀 하나당 RGBA 4바이트. 압축률과 무관하다. */
export const BYTES_PER_PIXEL = 4

export const decodeBytesOf = (entry: AssetEntry) => entry.pixels * BYTES_PER_PIXEL
`
}

const entries = await collect()
await writeFile(OUT_FILE, render(entries), 'utf8')

const total = entries.reduce((sum, e) => sum + e.bytes, 0)
const hot = entries.filter((e) => e.tier === 'hot').reduce((sum, e) => sum + e.pixels * 4, 0)
const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2)

console.log(`에셋 ${entries.length}개 → lib/assets/manifest.ts`)
console.log(`  파일 총합 ${mb(total)} MB · hot 디코딩 ${mb(hot)} MB`)
