import { describe, expect, it } from 'vitest'
import { CANVAS_HEIGHT, CANVAS_WIDTH, getCanvasScale } from './canvas'

describe('getCanvasScale', () => {
  it('캔버스와 같은 크기면 1배', () => {
    expect(getCanvasScale(CANVAS_WIDTH, CANVAS_HEIGHT)).toBe(1)
  })

  it('스탠바이미2 세로(1440×2560)에서 정확히 4/3배', () => {
    expect(getCanvasScale(1440, 2560)).toBeCloseTo(4 / 3, 10)
  })

  it('세로가 깎여 비율이 어긋나면 가로가 넘치지 않도록 작은 쪽을 쓴다', () => {
    // 전체화면 진입 전 주소창이 세로를 먹은 상황
    const scale = getCanvasScale(1440, 2400)
    expect(scale).toBe(2400 / CANVAS_HEIGHT)
    expect(CANVAS_WIDTH * scale).toBeLessThanOrEqual(1440)
  })

  it('가로가 좁아도 캔버스가 화면 안에 들어온다', () => {
    const scale = getCanvasScale(1000, 2560)
    expect(CANVAS_WIDTH * scale).toBeLessThanOrEqual(1000)
    expect(CANVAS_HEIGHT * scale).toBeLessThanOrEqual(2560)
  })
})
