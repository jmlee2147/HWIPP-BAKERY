'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH, getCanvasScale } from '@/lib/config/canvas'

interface FixedCanvasProps {
  children: ReactNode
}

/**
 * 1080×1920 캔버스를 화면 크기에 맞춰 통째로 scale 한다.
 * 안쪽에서는 Figma 좌표를 px 그대로 쓴다. `.claude/rules/architecture.md`
 */
export const FixedCanvas = ({ children }: FixedCanvasProps) => {
  // 측정 전에는 그리지 않는다 — 잘못된 배율로 한 프레임 깜빡이는 것을 막는다.
  const [scale, setScale] = useState<number | null>(null)

  useEffect(() => {
    const measure = () => {
      setScale(getCanvasScale(window.innerWidth, window.innerHeight))
    }

    measure()

    // 전체화면 진입·해제와 설치 시 화면 회전에 대응한다.
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
    }
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      {/*
        캔버스(1920px)가 뷰포트보다 클 때 grid 중앙 정렬은 넘침 처리가 브라우저마다 다르다.
        translate 로 중앙을 직접 잡으면 배율과 무관하게 항상 같은 위치다.
      */}
      <div
        className="absolute left-1/2 top-1/2 bg-cream"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale ?? 1})`,
          visibility: scale === null ? 'hidden' : 'visible',
        }}
      >
        {children}
      </div>
    </div>
  )
}
