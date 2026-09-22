import { ASSET_MANIFEST } from './manifest'

/**
 * hot 계층을 부팅 직후 받아 둔다.
 *
 * 서비스워커 캐시(디스크)가 있어도 **디코딩은 매번 일어난다.** 그래서 디스크 캐시와 별개로
 * 메모리에 올려 두는 층이 필요하다 (`.claude/rules/assets.md`).
 *
 * 받아 둔 이미지는 **해제하지 않는다.** 참조를 여기서 붙들고 있어야 브라우저가 비트맵을
 * 버리지 않는다 — Lottie 와 정반대 정책이라 헷갈리기 쉽다. 총량은 예산으로 상한 관리하고
 * `pnpm check:assets` 가 빌드에서 막는다.
 *
 * 이게 없으면 컷이 바뀌는 순간에야 그 컷의 에셋을 처음 받는다. 실제로 컷 1 → 2 전환(700ms)
 * 한가운데서 풀스크린 배경 한 장(디코딩 14MB)이 디코딩되고 있었다.
 */

/** 동시에 디코딩할 개수. TV SoC 에서 한꺼번에 풀면 첫 화면이 밀린다. */
const CONCURRENCY = 4

/**
 * 재시도 간격. 실패는 **사람이 확인할 일이 아니다** — 무기한 재시도한다
 * (`.claude/rules/operations.md`).
 */
const RETRY_BASE_MS = 500
const RETRY_MAX_MS = 30_000

const backoffMs = (attempt: number) => Math.min(RETRY_BASE_MS * 2 ** attempt, RETRY_MAX_MS)

/** 붙들어 두는 자리. 여기서 참조가 끊기면 프리로드가 무의미해진다. */
const held = new Map<string, HTMLImageElement>()

let running = false

/** 대기 중에 네트워크가 돌아오면 기다리지 않고 바로 다시 시도한다. */
const waitFor = (ms: number) =>
  new Promise<void>((resolve) => {
    let timer = 0
    const done = () => {
      window.clearTimeout(timer)
      window.removeEventListener('online', done)
      resolve()
    }
    timer = window.setTimeout(done, ms)
    window.addEventListener('online', done)
  })

const load = async (path: string) => {
  for (let attempt = 0; ; attempt += 1) {
    try {
      const image = new Image()
      image.src = path
      await image.decode()
      held.set(path, image)
      return
    } catch {
      await waitFor(backoffMs(attempt))
    }
  }
}

/**
 * hot 계층을 전부 받을 때까지 돈다. 두 번 불러도 한 번만 돈다.
 *
 * 화면을 막지 않는다 — 오프닝 컷 1 은 자기 에셋을 이미 그리고 있고, 이 함수는 그 뒤에서
 * 나머지 컷의 에셋을 채운다.
 */
export function preloadHotAssets() {
  if (running) return
  running = true

  // Lottie(JSON)는 이미지로 받을 수 없다. 연출이 붙을 때 별도 경로로 추가한다.
  const queue = ASSET_MANIFEST.filter((entry) => entry.tier === 'hot' && !entry.path.endsWith('.json')).map(
    (entry) => entry.path,
  )

  const worker = async () => {
    for (let next = queue.shift(); next; next = queue.shift()) await load(next)
  }

  void Promise.all(Array.from({ length: CONCURRENCY }, worker))
}

/** 받아 둔 개수. `/debug` 에서 확인용이고 화면 로직이 이 값에 의존하지 않는다. */
export const preloadedCount = () => held.size
