'use client'

import { useEffect, useRef } from 'react'
import { STAR_FLOW_HEADING, STAR_FLOW_SPEED_PX, STAR_FLOW_TURN_RATE } from './variants'

interface Heading {
  x: number
  y: number
}

/** 길이가 0이면 방향이 없다 — 화면 정중앙을 정확히 눌렀을 때만 나오므로 그때는 그대로 둔다. */
const unit = ({ x, y }: Heading, fallback: Heading): Heading => {
  const length = Math.hypot(x, y)
  return length === 0 ? fallback : { x: x / length, y: y / length }
}

/** 주기 격자라 한 칸을 지나면 같은 그림이다. 중앙을 0 으로 두고 ±반 칸에서 되감는다. */
const wrap = (value: number, period: number) => {
  const shifted = (((value + period / 2) % period) + period) % period
  return shifted - period / 2
}

/**
 * 주기 무늬를 한 방향으로 끝없이 흘린다.
 *
 * CSS 애니메이션으로 하면 왕복(`alternate`)이나 고정 방향 중 하나뿐이라
 * "누른 쪽으로 계속 흐르다가 다음에 누르면 그쪽으로 꺾이는" 움직임이 나오지 않는다.
 * 그래서 프레임마다 위치를 누적하고 격자 주기로 되감는다 — 되감는 순간의 그림이
 * 같으므로 이음새가 보이지 않고, 무늬 크기와 무관하게 무한히 흐른다.
 *
 * `transform` 만 건드리고 상태를 쓰지 않아 리렌더가 일어나지 않는다.
 */
export function useStarFlow(period: Heading) {
  const ref = useRef<HTMLDivElement>(null)
  const heading = useRef<Heading>(STAR_FLOW_HEADING)
  const target = useRef<Heading>(STAR_FLOW_HEADING)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const offset = { x: 0, y: 0 }
    let last = performance.now()
    let frame = 0

    const step = (now: number) => {
      // 탭 전환·절전 복귀로 프레임이 길게 비면 무늬가 한 번에 튄다. 한 프레임 몫으로 자른다.
      const seconds = Math.min((now - last) / 1000, 0.05)
      last = now

      const turn = 1 - Math.exp(-seconds * STAR_FLOW_TURN_RATE)
      heading.current = {
        x: heading.current.x + (target.current.x - heading.current.x) * turn,
        y: heading.current.y + (target.current.y - heading.current.y) * turn,
      }

      offset.x = wrap(offset.x + heading.current.x * STAR_FLOW_SPEED_PX * seconds, period.x)
      offset.y = wrap(offset.y + heading.current.y * STAR_FLOW_SPEED_PX * seconds, period.y)
      node.style.transform = `translate(${offset.x}px, ${offset.y}px)`

      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [period.x, period.y])

  /** 흐를 방향을 바꾼다. 꺾이는 데 시간이 걸려 방향이 튀지 않는다. */
  const steer = (x: number, y: number) => {
    target.current = unit({ x, y }, target.current)
  }

  return { ref, steer }
}
