'use client'

import { useState } from 'react'
import { ShopScene } from './ShopScene'
import { TitleScene } from './TitleScene'

/**
 * 오프닝 전체. 지금은 타이틀(컷 1)과 가게 앞(컷 2~3)뿐이고
 * 컷 4~8 이 붙으면 여기에 이어 붙인다.
 */
export const OpeningScene = () => {
  // 씬 진행도는 STEP 상태가 아니다. 세션 스토어에 넣지 않는다.
  const [started, setStarted] = useState(false)

  return started ? <ShopScene /> : <TitleScene onStart={() => setStarted(true)} />
}
