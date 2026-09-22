/**
 * 에셋 예산과 매니페스트 정합성을 검사한다. 어긋나면 **빌드를 실패시킨다** —
 * 코드로 우회하지 않는다 (`.claude/rules/assets.md`).
 *
 * 검사 항목
 * 1. 매니페스트가 최신인가 (스캔 결과와 파일 내용이 같은가)
 * 2. hot 계층 디코딩 합계가 예산 안인가
 * 3. 파일 총합이 예산 안인가
 * 4. Lottie 총합이 예산 안인가
 * 5. 매핑 테이블이 참조하는 키에 대응 파일이 실제로 있는가 (`lib/mapping` 이 생기면)
 *
 * 실행: `pnpm check:assets`
 */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { ASSET_BUDGET, BYTES_PER_PIXEL } from './asset-tiers.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const MANIFEST = join(ROOT, 'lib/assets/manifest.ts')

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2)
const failures = []

// 1. 매니페스트 최신성 — 생성물을 커밋하므로 에셋만 바뀌고 매니페스트가 그대로면 잡아야 한다
const before = await readFile(MANIFEST, 'utf8')
execFileSync('node', [join(ROOT, 'scripts/build-asset-manifest.mjs')], { stdio: 'pipe' })
const after = await readFile(MANIFEST, 'utf8')

if (before !== after) {
  failures.push(
    '매니페스트가 최신이 아니다. `pnpm build:manifest` 결과를 커밋한다.\n' +
      '    (이 검사가 방금 파일을 갱신했으므로 diff 를 확인하면 된다)',
  )
}

// 매니페스트에서 항목을 읽는다. TS 파일이라 정규식으로 뽑는다 — 이 형식은 생성 스크립트가 고정한다.
const entries = [...after.matchAll(/\{ path: '([^']+)', tier: '([^']+)', bytes: (\d+), pixels: (\d+) \}/g)].map(
  ([, path, tier, bytes, pixels]) => ({ path, tier, bytes: Number(bytes), pixels: Number(pixels) }),
)

if (entries.length === 0) failures.push('매니페스트에서 에셋을 하나도 읽지 못했다. 생성 형식이 바뀌었는가?')

// 2~4. 예산
const hotDecode = entries
  .filter((e) => e.tier === 'hot')
  .reduce((sum, e) => sum + e.pixels * BYTES_PER_PIXEL, 0)
const fileTotal = entries.reduce((sum, e) => sum + e.bytes, 0)
const lottieTotal = entries
  .filter((e) => e.path.startsWith('/lottie/'))
  .reduce((sum, e) => sum + e.bytes, 0)

const budgets = [
  ['hot 디코딩', hotDecode, ASSET_BUDGET.hotDecodeBytes],
  ['파일 총합', fileTotal, ASSET_BUDGET.fileBytes],
  ['Lottie 총합', lottieTotal, ASSET_BUDGET.lottieBytes],
]

console.log(`에셋 ${entries.length}개`)
for (const [label, used, limit] of budgets) {
  const percent = ((used / limit) * 100).toFixed(1)
  console.log(`  ${label.padEnd(12)} ${mb(used).padStart(8)} MB / ${mb(limit)} MB  (${percent}%)`)
  if (used > limit) failures.push(`${label} 예산 초과: ${mb(used)} MB > ${mb(limit)} MB`)
}

// 디코딩이 큰 순서로 몇 개 보여 준다. 예산이 차오를 때 어디부터 손댈지 바로 보이게.
const heaviest = [...entries]
  .filter((e) => e.pixels > 0)
  .sort((a, b) => b.pixels - a.pixels)
  .slice(0, 5)
console.log('  가장 무거운 에셋(디코딩 기준)')
for (const entry of heaviest) {
  console.log(`    ${mb(entry.pixels * BYTES_PER_PIXEL).padStart(7)} MB  ${entry.path}`)
}

// 5. 매핑 키 ↔ 파일 교차 검증. 여기서 잡지 못하면 전시 중 깨진 이미지가 된다.
try {
  const mappingDir = join(ROOT, 'lib/mapping')
  const { readdir } = await import('node:fs/promises')
  await readdir(mappingDir)
  console.log('  주의: lib/mapping 이 생겼다. 키 ↔ 파일 교차 검증을 이 스크립트에 추가한다.')
} catch {
  // 아직 매핑 테이블이 없다. AI 파이프라인(4단계)에서 생긴다.
}

if (failures.length > 0) {
  console.error('\n실패')
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}

console.log('\n통과')
