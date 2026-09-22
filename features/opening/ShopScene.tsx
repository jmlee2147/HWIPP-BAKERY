'use client'

import { useEffect, useState } from 'react'
import { Typewriter } from '@/components/motion/Typewriter'
import { typeDurationMs } from '@/components/motion/variants'
import { DialogBox } from '@/components/ui/DialogBox'
import { fromRotatedArtboard } from '@/lib/config/artboard'
import { SignLogo } from './SignLogo'
import { TouchHint } from './TouchHint'
import {
  DOOR_OPEN_PATCH,
  DOOR_PATCH_BOX,
  OPENING_CUTS,
  OPENING_LAYOUT,
  SHOP_BACKGROUND,
  type OpeningCut,
} from './script'

const BACKGROUND = fromRotatedArtboard(OPENING_LAYOUT.background)
const DIALOG = fromRotatedArtboard(OPENING_LAYOUT.dialog)

interface ShopSceneProps {
  /** 마지막 컷에서 한 번 더 탭한 시점. 가게 안으로 들어간다. */
  onEnter: () => void
}

/**
 * 오프닝 컷 2~3 — 가게 앞. 화면을 탭하면 다음 컷으로 넘어가고,
 * 문이 열린 컷에서 한 번 더 탭하면 매장 안(컷 4)으로 들어간다.
 */
export const ShopScene = ({ onEnter }: ShopSceneProps) => {
  // 컷 진행은 씬 안의 연출 진행도지 STEP 상태가 아니다. 세션 스토어에 넣지 않는다.
  const [cut, setCut] = useState<OpeningCut>(OPENING_CUTS[0])
  const [revealed, setRevealed] = useState(false)
  const nextCut = OPENING_CUTS[OPENING_CUTS.findIndex((each) => each.id === cut.id) + 1]
  const charCount = cut.lines.reduce((sum, line) => sum + [...line].length, 0)

  // 타이핑이 끝나면 안내문을 띄운다. CSS 쪽 딜레이와 같은 시간을 쓴다.
  useEffect(() => {
    if (revealed) return
    const timer = setTimeout(() => setRevealed(true), typeDurationMs(charCount))
    return () => clearTimeout(timer)
  }, [revealed, charCount])

  /** 타이핑 중이면 먼저 끝까지 보여주고, 다 나온 뒤에야 다음 컷으로 넘어간다. */
  const advance = () => {
    if (!revealed) {
      setRevealed(true)
      return
    }
    if (!nextCut) {
      onEnter()
      return
    }
    setCut(nextCut)
    // 대사가 그대로면 다시 타이핑하지 않는다 — 같은 말을 두 번 치는 것처럼 보인다.
    setRevealed(nextCut.lines.join('\n') === cut.lines.join('\n'))
  }

  return (
    <main
      className="absolute inset-0 overflow-hidden"
      style={{ background: cut.canvasColor }}
      onPointerDown={advance}
    >
      {/*
        배경은 한 장만 두고 문만 패치로 덮는다 — 배경째 교차하면 문이 아니라 화면이 흔들린다.
        근거는 `script.ts` 의 `DOOR_PATCH_BOX` 주석.
        hot 계층이라 해제하지 않는다 — Lottie 와 정반대 정책이다 (`.claude/rules/assets.md`).
      */}
      {/* 문 열림만 부드럽게 간다. 나머지 연출은 끊기는 쪽이 이 오프닝의 성격이다. */}
      <div
        className="absolute transition-opacity duration-slow ease-move"
        style={{ ...BACKGROUND, opacity: cut.backgroundOpacity }}
      >
        <img src={SHOP_BACKGROUND} alt="" className="absolute inset-0 block h-full w-full max-w-none" />
        <img
          src={DOOR_OPEN_PATCH}
          alt=""
          className="absolute block max-w-none transition-opacity duration-slow ease-move"
          style={{ ...DOOR_PATCH_BOX, opacity: cut.doorOpen ? 1 : 0 }}
        />
      </div>

      <SignLogo />

      <div className="absolute" style={{ left: DIALOG.left, top: DIALOG.top }}>
        <DialogBox>
          <Typewriter key={cut.id} lines={cut.lines} revealed={revealed} />
        </DialogBox>
      </div>

      {/* 안내문은 대사가 다 나온 뒤에 띄운다. 먼저 뜨면 대사를 덜 읽고 넘긴다. */}
      {revealed && <TouchHint>{cut.hint}</TouchHint>}
    </main>
  )
}
