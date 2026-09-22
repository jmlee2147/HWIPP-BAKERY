'use client'

import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { useStarFlow } from '@/components/motion/useStarFlow'
import {
  CLIP_DROP_DELAY_MS,
  DECO_TWINKLE_MS,
  decoTwinkleDelayMs,
  START_POP_DELAY_MS,
  STAR_STEER_MIN_PX,
} from '@/components/motion/variants'
import { fromArtboardMeta } from '@/lib/config/artboard'
import { Pinned } from './Pinned'
import { TitleCard } from './TitleCard'
import { TitleLogo } from './TitleLogo'
import {
  DOT_PANELS,
  LOGO_STAR_GRID,
  START_INNER,
  TITLE_CARDS,
  TITLE_DECOS,
  TITLE_STRIPES,
  TITLE_LAYOUT,
  WALL_BOX,
  type DotPanel,
} from './script'

const place = fromArtboardMeta
const BOARD = place(TITLE_LAYOUT.board)
const BOARD_INNER = place(TITLE_LAYOUT.boardInner)
const PANEL_TOP = place(TITLE_LAYOUT.panelTop)
const TOPBAR = place(TITLE_LAYOUT.topbar)
const START = place(TITLE_LAYOUT.startButton)

/** 엇갈린 격자라 같은 무늬를 반 칸 밀어 두 겹으로 깐다. */
const dotPanel = ({
  box,
  cell,
  radius,
  offsetX,
  offsetY,
}: DotPanel): CSSProperties => {
  const layer = `radial-gradient(circle ${radius}px at center, var(--color-dot) 99%, transparent 100%)`
  return {
    ...box,
    backgroundColor: '#fff',
    backgroundImage: `${layer}, ${layer}`,
    backgroundSize: `${cell}px ${cell}px`,
    backgroundPosition: `${offsetX}px ${offsetY}px, ${offsetX + cell / 2}px ${offsetY + cell / 2}px`,
  }
}

interface TitleSceneProps {
  onStart: () => void
}

/**
 * 컷 1 — 전시의 얼굴이 되는 타이틀 화면.
 * 관람객이 없는 동안 가장 오래 떠 있다 (`.claude/rules/state-machine.md`).
 */
export const TitleScene = ({ onStart }: TitleSceneProps) => {
  const stars = useStarFlow(LOGO_STAR_GRID)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)

  /** 터치는 누른 자리에서 시작한다. 직전 세션의 좌표와 비교하면 엉뚱한 방향이 나온다. */
  const markPoint = (event: PointerEvent<HTMLElement>) => {
    lastPoint.current = { x: event.clientX, y: event.clientY }
  }

  /**
   * 별판은 **포인터가 움직인 방향**으로 흐른다. 멈추면 마지막 방향 그대로 계속 흐른다 —
   * 따라오는 것이 아니라 밀어 준 방향으로 계속 간다.
   *
   * 실기에는 커서가 없어 손가락을 끄는 동안에만 방향이 바뀐다
   * (`.claude/rules/project-constraints.md`). 그 사이에도 흐름은 멈추지 않는다.
   * 이동량의 방향만 쓰므로 캔버스 배율과 무관하다.
   */
  const steerStars = (event: PointerEvent<HTMLElement>) => {
    const previous = lastPoint.current
    lastPoint.current = { x: event.clientX, y: event.clientY }
    if (!previous) return

    const dx = event.clientX - previous.x
    const dy = event.clientY - previous.y
    if (Math.hypot(dx, dy) < STAR_STEER_MIN_PX) return

    stars.steer(dx, dy)
  }

  return (
    <main
      className="absolute inset-0 overflow-hidden bg-cream"
      onPointerDown={markPoint}
      onPointerMove={steerStars}
    >
      {/* 벽지는 Figma 가 화면에 걸치는 부분만 잘라 내보내므로 박스에 그대로 채운다. */}
      <img src="/img/opening/title/wall.avif" alt="" className="absolute block max-w-none" style={WALL_BOX} />

      {/* 액자. 세 겹 모두 단색이라 이미지를 쓰지 않는다 — 근거는 `script.ts` 의 TITLE_LAYOUT 주석. */}
      <div className="absolute bg-cocoa" style={BOARD} />
      <div className="absolute bg-board" style={BOARD_INNER} />
      <div className="absolute bg-panel" style={PANEL_TOP} />

      {/* 도트 판. 근거는 `script.ts` 의 DOT_PATTERN 주석. */}
      <div className="absolute" style={dotPanel(DOT_PANELS.top)} />
      <div className="absolute" style={dotPanel(DOT_PANELS.bottom)} />

      {/*
        줄무늬는 배경이라 카드보다 먼저 깔고 움직이지 않는다.
        PNG 인 이유는 `logo-big` 과 같다 — sips 로 만든 큰 알파 AVIF 를 Chromium 이 그리지 못한다.
      */}
      <Pinned src="/img/opening/title/stripes.png" box={TITLE_STRIPES} />

      {TITLE_CARDS.map((card, index) => (
        <TitleCard key={card.key} card={card} index={index} />
      ))}

      {/* 장식은 차례로 하나씩 반짝인다. 한꺼번에 튀면 화면이 시끄럽다. */}
      {TITLE_DECOS.map((deco, index) => (
        <Pinned
          key={deco.id}
          src={`/img/opening/title/deco-${deco.src}.avif`}
          box={deco.box}
          flipX={deco.flipX}
          className="animate-deco-twinkle"
          style={
            {
              '--twinkle-dur': `${DECO_TWINKLE_MS}ms`,
              animationDelay: `${decoTwinkleDelayMs(index, TITLE_DECOS.length)}ms`,
            } as CSSProperties
          }
        />
      ))}

      <TitleLogo starRef={stars.ref} />
      <Pinned
        src="/img/opening/title/clip.avif"
        box={TITLE_LAYOUT.clip}
        className="animate-logo-drop"
        style={{ animationDelay: `${CLIP_DROP_DELAY_MS}ms` }}
      />

      <img src="/img/opening/title/topbar.avif" alt="" className="absolute block max-w-none" style={TOPBAR} />
      <Pinned src="/img/opening/title/logo-small.avif" box={TITLE_LAYOUT.logoSmall} />

      {/*
        START! — 구조는 ChoiceButton 과 닮았지만 크기도 불투명도도 달라 따로 그린다.
        글자는 Figma 가 Ownglyph MeowWriting 을 쓰는데 파일이 없어 본문 폰트로 대신한다.
        진입(한 번)과 상시 어포던스를 겹으로 나눈다 — 한 요소에 두면 뒤 것이 앞 것을 덮어쓴다.
      */}
      <div
        className="absolute animate-start-pop"
        style={{ ...START, animationDelay: `${START_POP_DELAY_MS}ms` }}
      >
        <button type="button" className="absolute inset-0 animate-start-bounce" onPointerDown={onStart}>
          <div
            className="absolute inset-0 rounded-[9.139px] bg-plate opacity-[0.49]"
            style={{ boxShadow: 'var(--shadow-start)' }}
          />
          <div
            className="absolute rounded-[9.139px] border-[0.366px] border-plate-line bg-blush opacity-[0.49]"
            style={{ ...START_INNER, boxShadow: 'var(--shadow-start-inset)' }}
          />
          <span
            className="absolute inset-0 grid place-items-center whitespace-nowrap text-roast"
            style={{ fontSize: 25.559, letterSpacing: '4.6006px' }}
          >
            START!
          </span>
        </button>
      </div>
    </main>
  )
}
