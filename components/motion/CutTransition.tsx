'use client'

import { useEffect, useRef, type AnimationEvent, type ReactNode } from 'react'
import { CUT_TRANSITION_FALLBACK_MS } from './variants'

/**
 * 컷이 놓인 상태. 나가는 컷과 들어오는 컷이 잠시 함께 떠 있다.
 * 전환 중에는 입력을 막는다 — 겹쳐 있는 동안의 탭이 다음 컷으로 새어 들어간다.
 */
const PHASE = {
  present: '',
  entering: 'animate-cut-enter pointer-events-none',
  leaving: 'animate-cut-leave pointer-events-none',
} as const

export type CutPhase = keyof typeof PHASE

interface CutTransitionProps {
  phase: CutPhase
  /** 나가는 연출이 끝난 시점. 여기서 이전 컷을 내린다. */
  onLeft?: () => void
  children: ReactNode
}

/**
 * 오프닝 컷 사이의 전환. 컷은 자기가 어떻게 등장하고 사라지는지 알지 못한다
 * (`.claude/rules/motion.md`).
 *
 * 나가는 컷은 다가오며 흐려지고 들어오는 컷은 물러선 자리에서 다가온다 —
 * 타이틀에서 가게 앞으로 **들어가는** 장면이라 두 컷이 같은 방향으로 움직인다.
 * 끝나는 시점은 타이머가 아니라 애니메이션 종료로 안다. 시간을 두 곳에 적지 않는다.
 * 다만 그 신호가 오지 않으면 두 컷 모두 입력이 막힌 채 남으므로 안전망을 하나 둔다.
 */
export const CutTransition = ({ phase, onLeft, children }: CutTransitionProps) => {
  const leave = useRef(onLeft)
  leave.current = onLeft

  const finish = (event: AnimationEvent<HTMLDivElement>) => {
    // 컷 안쪽 요소의 애니메이션도 여기까지 올라온다. 이 겹의 것만 받는다.
    if (event.target !== event.currentTarget) return
    if (phase === 'leaving') leave.current?.()
  }

  // 신호가 오지 않아도 전환에서 빠져나온다. 먼저 끝나면 타이머는 그대로 버려진다.
  useEffect(() => {
    if (phase !== 'leaving') return

    const timer = window.setTimeout(() => leave.current?.(), CUT_TRANSITION_FALLBACK_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  return (
    <div className={`absolute inset-0 ${PHASE[phase]}`} onAnimationEnd={finish}>
      {children}
    </div>
  )
}
