'use client'

import { useState } from 'react'
import { CutTransition } from '@/components/motion/CutTransition'
import { InteriorScene } from './InteriorScene'
import { ShopScene } from './ShopScene'
import { TitleScene } from './TitleScene'
import type { OpeningExit } from './script'

type Scene = 'title' | 'shop' | 'interior'

interface OpeningSceneProps {
  /** 컷 8 을 지난 시점. 여기서 STEP.1 로 넘어간다. */
  onFinish: (exit: OpeningExit) => void
}

/**
 * 오프닝 전체 — 타이틀(컷 1) · 가게 앞(컷 2~3) · 매장 안(컷 4~8).
 *
 * 전환 중에는 두 씬이 함께 떠 있다. 먼저 내린 뒤에 올리면 중간에 빈 화면이 지나가 툭 끊긴다.
 * 걷히는 쪽이 **위**에 있어야 안으로 들어가는 것처럼 읽히므로 나가는 씬을 뒤에 그린다
 * (`docs/MOTION.md`).
 *
 * 겹을 키로 묶어 두는 것이 중요하다 — 자리로만 그리면 씬이 순서를 바꿀 때 React 가
 * 컴포넌트를 다시 마운트해서, **걷히는 동안 그 씬이 첫 컷으로 되돌아간다.**
 */
export const OpeningScene = ({ onFinish }: OpeningSceneProps) => {
  // 씬 진행도는 STEP 상태가 아니다. 세션 스토어에 넣지 않는다.
  const [scene, setScene] = useState<Scene>('title')
  const [leaving, setLeaving] = useState<Scene | null>(null)

  const go = (next: Scene) => {
    setLeaving(scene)
    setScene(next)
  }

  const view = (which: Scene) => {
    if (which === 'title') return <TitleScene onStart={() => go('shop')} />
    if (which === 'shop') return <ShopScene onEnter={() => go('interior')} />
    return <InteriorScene onFinish={onFinish} />
  }

  return (
    <>
      {(leaving ? [scene, leaving] : [scene]).map((which) => (
        <CutTransition
          key={which}
          phase={which === leaving ? 'leaving' : leaving ? 'entering' : 'present'}
          onLeft={which === leaving ? () => setLeaving(null) : undefined}
        >
          {view(which)}
        </CutTransition>
      ))}
    </>
  )
}
