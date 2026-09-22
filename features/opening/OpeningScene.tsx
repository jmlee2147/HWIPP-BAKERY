'use client'

import { useState } from 'react'
import { CutTransition } from '@/components/motion/CutTransition'
import { ShopScene } from './ShopScene'
import { TitleScene } from './TitleScene'

/**
 * 오프닝 전체. 지금은 타이틀(컷 1)과 가게 앞(컷 2~3)뿐이고
 * 컷 4~8 이 붙으면 여기에 이어 붙인다.
 *
 * `entering` 동안에는 두 컷이 함께 떠 있다. 컷 1 이 사라진 뒤에 컷 2 를 올리면
 * 중간에 빈 화면이 지나가 툭 끊긴다.
 */
export const OpeningScene = () => {
  // 씬 진행도는 STEP 상태가 아니다. 세션 스토어에 넣지 않는다.
  const [cut, setCut] = useState<'title' | 'entering' | 'shop'>('title')

  return (
    <>
      {/* 가게 앞이 아래, 타이틀이 위다. 걷히는 쪽이 위에 있어야 들어가는 것처럼 보인다. */}
      {cut !== 'title' && (
        <CutTransition phase={cut === 'entering' ? 'entering' : 'present'}>
          <ShopScene />
        </CutTransition>
      )}

      {cut !== 'shop' && (
        <CutTransition
          phase={cut === 'entering' ? 'leaving' : 'present'}
          onLeft={() => setCut('shop')}
        >
          <TitleScene onStart={() => setCut('entering')} />
        </CutTransition>
      )}
    </>
  )
}
