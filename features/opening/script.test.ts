import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  BAKER_POSES,
  CAKE_SLICES,
  TITLE_CARDS,
  INTERIOR_BACKGROUNDS,
  INTERIOR_CUTS,
  type InteriorCut,
  type InteriorCutId,
} from './script'

const PUBLIC = join(import.meta.dirname, '../../public')
const onDisk = (path: string) => existsSync(join(PUBLIC, path))

/** 케이크 조각은 키로 경로를 조합한다. 키가 틀리면 전시 중 깨진 이미지가 된다. */
const slicePath = (key: string) => `/img/opening/interior/slice-${key}.avif`

describe('오프닝 컷 4~8 에셋', () => {
  it.each(CAKE_SLICES.map((slice) => slice.key))('케이크 조각 %s 파일이 있다', (key) => {
    expect(onDisk(slicePath(key))).toBe(true)
  })

  it.each(CAKE_SLICES.flatMap((slice) => (slice.stars ?? []).map((star) => star.src)))(
    '별 %s 파일이 있다',
    (src) => {
      expect(onDisk(src)).toBe(true)
    },
  )

  it.each(Object.entries(BAKER_POSES))('제빵사 %s 파일이 있다', (_pose, data) => {
    expect(onDisk(data.src)).toBe(true)
  })

  it.each(Object.entries(INTERIOR_BACKGROUNDS))('배경 %s 파일이 있다', (_key, src) => {
    expect(onDisk(src)).toBe(true)
  })

  it('케이크 조각 키가 컷 1 카드 어휘 안에 있다 — 같은 케이크를 두 이름으로 부르지 않는다', () => {
    const cards = new Set<string>(TITLE_CARDS.map((card) => card.key))
    for (const slice of CAKE_SLICES) expect(cards.has(slice.key)).toBe(true)
  })
})

describe('오프닝 컷 4~8 전이', () => {
  // `as const` 로 좁혀진 리터럴이라 없는 칸을 읽을 수 없다. 선언 타입으로 넓혀서 본다.
  const cuts: readonly InteriorCut[] = INTERIOR_CUTS
  const ids = new Set<string>(cuts.map((cut) => cut.id))

  it('컷 id 가 중복되지 않는다', () => {
    expect(ids.size).toBe(cuts.length)
  })

  it.each(cuts.map((cut) => cut.id))('컷 %s 에서 나가는 길이 모두 실재한다', (id) => {
    const cut = cuts.find((each) => each.id === id)!
    const targets: InteriorCutId[] = [
      ...(cut.next ? [cut.next] : []),
      ...(cut.choices ?? []).flatMap((choice) => (choice.next ? [choice.next] : [])),
    ]
    for (const target of targets) expect(ids.has(target)).toBe(true)
  })

  it('모든 컷에 나가는 길이 하나는 있다 — 없으면 관람객이 갇힌다', () => {
    for (const cut of cuts) {
      const exits = [
        ...(cut.next ? [cut.next] : []),
        ...(cut.choices ?? []).map((choice) => choice.next ?? choice.exit),
      ].filter(Boolean)
      expect(exits.length).toBeGreaterThan(0)
    }
  })

  it('선택지는 다음 컷이나 오프닝 종료 중 하나만 갖는다', () => {
    for (const cut of cuts) {
      for (const choice of cut.choices ?? []) {
        expect(Boolean(choice.next) !== Boolean(choice.exit)).toBe(true)
      }
    }
  })

  it('자동 전환 컷은 넘어갈 곳을 갖는다', () => {
    for (const cut of cuts) {
      if (cut.autoAdvance) expect(cut.next).toBeTruthy()
    }
  })

  it('탭으로 넘어가는 컷에는 탭 안내문이 있다 — 터치에는 hover 어포던스가 없다', () => {
    for (const cut of cuts) {
      if (cut.next && !cut.autoAdvance && !cut.choices) expect(cut.hint).toBeTruthy()
    }
  })
})
