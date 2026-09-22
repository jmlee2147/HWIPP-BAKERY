'use client'

import { useState } from 'react'
import { OpeningScene } from '@/features/opening/OpeningScene'

export default function KioskPage() {
  /**
   * 오프닝이 끝나면 처음으로 되돌린다.
   *
   * STEP.1 은 상태 머신(구현 순서 2단계)과 함께 붙는다. 그때까지 관람객이 마지막 컷에
   * 갇히지 않도록 오프닝을 다시 돌린다 — 유휴 리셋이 하게 될 동작과 같다.
   * `exit` 는 STEP.1 이 분기에 쓸 값이라 지금은 세션을 새로 여는 신호로만 쓴다.
   */
  const [run, setRun] = useState(0)

  return <OpeningScene key={run} onFinish={() => setRun((count) => count + 1)} />
}
