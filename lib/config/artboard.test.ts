import { describe, expect, it } from 'vitest'
import { fromArtboardMeta, fromRotatedArtboard, rotateOffset, unionBox } from './artboard'

/**
 * 기대값은 Figma 실측값과 스크린샷 대조로 검증한 것이다.
 * 변환이 틀어지면 오프닝 전체가 어긋나므로 대표 요소로 고정해 둔다.
 */
describe('fromRotatedArtboard', () => {
  it('하단 안내문을 화면 하단 중앙으로 옮긴다', () => {
    // Figma `1:80188` — left calc(50%-851px) = 109
    const box = fromRotatedArtboard({ left: 109, top: 362, width: 93, height: 357 })

    expect(box).toEqual({ left: 362, top: 1718, width: 357, height: 93 })
    // 가로 중심이 캔버스 중앙에 온다
    expect(box.left + box.width / 2).toBeCloseTo(540.5, 1)
  })

  it('대화 박스를 화면 상단 좌우 대칭 위치로 옮긴다', () => {
    // Figma `1:80064`
    const box = fromRotatedArtboard({ left: 1538.86, top: 59, width: 319.133, height: 962.444 })

    expect(box.left).toBeCloseTo(59, 3)
    expect(box.top).toBeCloseTo(62.007, 3)
    expect(box.width).toBeCloseTo(962.444, 3)
    expect(box.height).toBeCloseTo(319.133, 3)
  })

  it('풀스크린 배경을 캔버스 전체로 옮긴다', () => {
    const box = fromRotatedArtboard({ left: 0, top: 0, width: 1920, height: 1080 })

    expect(box).toEqual({ left: 0, top: 0, width: 1080, height: 1920 })
  })
})

describe('fromArtboardMeta', () => {
  it('design context 로 검증한 대화 박스와 같은 자리를 준다', () => {
    // 같은 노드(`1:80064`)를 metadata 로 읽은 값
    const box = fromArtboardMeta({ x: 1857.999, y: 59.004, width: 962.444, height: 319.133 })

    expect(box.left).toBeCloseTo(59.004, 2)
    expect(box.top).toBeCloseTo(62.001, 2)
    expect(box.width).toBeCloseTo(962.444, 3)
    expect(box.height).toBeCloseTo(319.133, 3)
  })

  it('하단 START 버튼을 캔버스 하단으로 옮긴다', () => {
    // Figma `1:78155`
    expect(fromArtboardMeta({ x: 146, y: 172, width: 734.603, height: 83 })).toEqual({
      left: 172,
      top: 1774,
      width: 734.603,
      height: 83,
    })
  })
})

describe('rotateOffset', () => {
  it('오른쪽아래 그림자를 왼쪽아래로 돌린다', () => {
    expect(rotateOffset(3, 3)).toEqual({ x: -3, y: 3 })
  })
})

describe('unionBox', () => {
  it('떨어져 있는 조각을 모두 덮는 박스를 준다', () => {
    const box = unionBox([
      { left: 100, top: 200, width: 50, height: 50 },
      { left: 80, top: 260, width: 120, height: 40 },
    ])

    expect(box).toEqual({ left: 80, top: 200, width: 120, height: 100 })
  })

  it('한 장만 주면 그 박스를 그대로 준다', () => {
    const only = { left: 12, top: 34, width: 56, height: 78 }

    expect(unionBox([only])).toEqual(only)
  })

  // 조용히 넘기면 -Infinity 박스가 나와 그룹이 화면에서 사라진다
  it('빈 배열은 던진다', () => {
    expect(() => unionBox([])).toThrow()
  })
})
