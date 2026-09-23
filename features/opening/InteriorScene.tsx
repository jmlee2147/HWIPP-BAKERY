'use client'

import { useEffect, useState } from 'react'
import { Typewriter } from '@/components/motion/Typewriter'
import {
  CHOICE_IN_STEP_MS,
  SHOWCASE_DELAY_MS,
  typeDurationMs,
} from '@/components/motion/variants'
import { ChoiceButton } from '@/components/ui/ChoiceButton'
import { DialogBox } from '@/components/ui/DialogBox'
import { fromRotatedArtboard } from '@/lib/config/artboard'
import { CakeSlice } from './CakeSlice'
import { Pinned } from './Pinned'
import { TouchHint } from './TouchHint'
import {
  BAKER_POSES,
  CAKE_SLICES,
  CHOICE_SLOTS,
  INTERIOR_BACKGROUNDS,
  INTERIOR_CANVAS_COLOR,
  INTERIOR_CUTS,
  OPENING_LAYOUT,
  type InteriorChoice,
  type InteriorCut,
  type InteriorCutId,
  type OpeningExit,
} from './script'

const DIALOG = fromRotatedArtboard(OPENING_LAYOUT.dialog)

const cutById = (id: InteriorCutId) => INTERIOR_CUTS.find((each) => each.id === id)

interface InteriorSceneProps {
  /** 컷 8 선택지를 누른 순간. 오프닝은 여기서 끝난다. */
  onFinish: (exit: OpeningExit) => void
}

/**
 * 오프닝 컷 4~8 — 매장 안. 선택지 두 컷(4·8)과 안내 세 컷(5~7)으로 갈린다.
 *
 * 배경·제빵사는 컷마다 `src` 를 갈아끼우지 않고 **전부 올려두고 불투명도만 바꾼다.**
 * 교체하면 그 순간 디코딩이 일어나 TV SoC 에서 탭 반응이 밀린다.
 * 파일은 부팅 때 hot 계층으로 미리 받아 두므로(`lib/assets/preload.ts`) 남는 비용은
 * 디코딩뿐이고, 그것도 이 씬에 들어설 때 한 번이다 (`.claude/rules/assets.md`).
 */
export const InteriorScene = ({ onFinish }: InteriorSceneProps) => {
  // 컷 진행은 씬 안의 연출 진행도지 STEP 상태가 아니다. 세션 스토어에 넣지 않는다.
  const [cut, setCut] = useState<InteriorCut>(INTERIOR_CUTS[0])
  const [revealed, setRevealed] = useState(false)
  const charCount = cut.lines.reduce((sum, line) => sum + [...line].length, 0)

  // 타이핑이 끝나는 시점. 안내문·선택지가 여기에 맞춰 뜬다.
  useEffect(() => {
    if (revealed) return
    const timer = setTimeout(() => setRevealed(true), typeDurationMs(charCount))
    return () => clearTimeout(timer)
  }, [revealed, charCount])

  const goTo = (id: InteriorCutId) => {
    const next = cutById(id)
    if (!next) return
    setCut(next)
    // 대사가 그대로면 다시 타이핑하지 않는다 — 같은 말을 두 번 치는 것처럼 보인다.
    setRevealed(next.lines.join('\n') === cut.lines.join('\n'))
  }

  // 컷 5 는 대사가 끝나면 사람 입력 없이 컷 6 으로 넘어간다. 근거는 `script.ts` 주석.
  useEffect(() => {
    if (!cut.autoAdvance || !cut.next || !revealed) return
    const target = cut.next
    const timer = setTimeout(() => goTo(target), SHOWCASE_DELAY_MS)
    return () => clearTimeout(timer)
    // goTo 는 렌더마다 새로 만들어지지만 타이머가 보는 값은 이 컷의 것이다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cut, revealed])

  /** 타이핑 중이면 먼저 끝까지 보여주고, 다 나온 뒤에야 다음 컷으로 넘어간다. */
  const advance = () => {
    if (!revealed) {
      setRevealed(true)
      return
    }
    if (cut.choices || !cut.next) return
    goTo(cut.next)
  }

  const pick = (choice: InteriorChoice) => {
    if (choice.exit) {
      onFinish(choice.exit)
      return
    }
    if (choice.next) goTo(choice.next)
  }

  return (
    <main
      className="absolute inset-0 overflow-hidden"
      style={{ background: INTERIOR_CANVAS_COLOR }}
      onPointerDown={advance}
    >
      {/* hot 계층이라 해제하지 않는다 — Lottie 와 정반대 정책이다 (`.claude/rules/assets.md`). */}
      {Object.entries(INTERIOR_BACKGROUNDS).map(([key, src]) => (
        <img
          key={key}
          src={src}
          alt=""
          className="absolute inset-0 block h-full w-full max-w-none"
          style={{ opacity: cut.background === key ? 1 : 0 }}
        />
      ))}

      {/* 케이크는 컷 6 에 들어설 때 한 장씩 튀어 들어오고, 컷 7 까지 그대로 남는다. */}
      <div className="absolute inset-0" style={{ opacity: cut.slices ? 1 : 0 }}>
        {CAKE_SLICES.map((slice, index) => (
          <CakeSlice key={slice.key} slice={slice} index={index} popping={cut.slices} />
        ))}
      </div>

      {Object.entries(BAKER_POSES).map(([pose, data]) => (
        <Pinned
          key={pose}
          src={data.src}
          box={data.box}
          style={{ opacity: cut.baker === pose ? 1 : 0 }}
        />
      ))}

      <div className="absolute" style={{ left: DIALOG.left, top: DIALOG.top }}>
        <DialogBox>
          <Typewriter key={cut.id} lines={cut.lines} revealed={revealed} />
        </DialogBox>
      </div>

      {/* 안내문과 선택지는 대사가 다 나온 뒤에 띄운다. 먼저 뜨면 대사를 덜 읽고 넘긴다. */}
      {revealed && cut.hint && <TouchHint>{cut.hint}</TouchHint>}

      {revealed &&
        cut.choices?.map((choice, index) => (
          <div
            key={choice.label}
            className="absolute animate-choice-in"
            style={{ ...CHOICE_SLOTS[index], animationDelay: `${index * CHOICE_IN_STEP_MS}ms` }}
          >
            <ChoiceButton variant={choice.variant} onPointerDown={() => pick(choice)}>
              {choice.label}
            </ChoiceButton>
          </div>
        ))}
    </main>
  )
}
