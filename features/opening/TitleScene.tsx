import type { CSSProperties } from 'react'
import { fromArtboardMeta, type MetaBox } from '@/lib/config/artboard'
import { TitleLogo } from './TitleLogo'
import {
  ASSET_SCALE,
  DOT_PANELS,
  type DotPanel,
  START_INNER,
  TITLE_CAKES,
  TITLE_DECOS,
  TITLE_LABELS,
  TITLE_STRIPES,
  TITLE_LAYOUT,
  WALL_BOX,
} from './script'

const place = fromArtboardMeta
const BOARD = place(TITLE_LAYOUT.board)
const BOARD_INNER = place(TITLE_LAYOUT.boardInner)
const PANEL_TOP = place(TITLE_LAYOUT.panelTop)
const TOPBAR = place(TITLE_LAYOUT.topbar)

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
const START = place(TITLE_LAYOUT.startButton)

interface PinnedProps {
  src: string
  box: MetaBox
  className?: string
  style?: CSSProperties
  /** 좌우 반전. 같은 그림이 뒤집혀 두 번 쓰일 때 파일을 하나만 둔다. */
  flipX?: boolean
  /** 내보내기 바운딩 보정. `script.ts` 의 NUDGE 주석 참고. */
  nudge?: { x: number; y: number }
}

/**
 * 노드 자리에 에셋을 **중심만 맞춰** 얹는다.
 *
 * Figma 내보내기는 그림자까지 포함해 노드 박스보다 조금 크다(2.00~2.29x).
 * 박스에 억지로 맞추면 그림이 눌리므로 원본 비율을 지키고 중심을 맞춘다.
 * 크기를 코드에 적지 않아도 되게 CSS 로 처리한다 — 에셋을 다시 받아도 코드는 그대로다.
 */
const Pinned = ({ src, box, className, style, flipX = false, nudge }: PinnedProps) => {
  const seat = place(box)
  return (
    <div
      className={`absolute ${className ?? ''}`}
      style={{ ...seat, left: seat.left + (nudge?.x ?? 0), top: seat.top + (nudge?.y ?? 0), ...style }}
    >
      <img
        src={src}
        alt=""
        className="absolute left-1/2 top-1/2 block max-w-none"
        style={{
          transform: `translate(-50%, -50%) scale(${flipX ? -ASSET_SCALE : ASSET_SCALE}, ${ASSET_SCALE})`,
        }}
      />
    </div>
  )
}

interface TitleSceneProps {
  onStart: () => void
}

/**
 * 컷 1 — 전시의 얼굴이 되는 타이틀 화면.
 * 관람객이 없는 동안 가장 오래 떠 있다 (`.claude/rules/state-machine.md`).
 */
export const TitleScene = ({ onStart }: TitleSceneProps) => (
  <main className="absolute inset-0 overflow-hidden bg-cream">
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

    {TITLE_CAKES.map((cake) => (
      <Pinned
        key={cake.key}
        src={`/img/opening/title/cake-${cake.key}.avif`}
        box={cake.box}
        nudge={cake.nudge}
        className="animate-cake-float"
        style={{ animationDelay: `${cake.delayMs}ms` }}
      />
    ))}

    {TITLE_LABELS.map((label) => (
      <div key={label.key}>
        <div
          className="absolute border-[0.675px] border-cocoa bg-cream"
          style={{ ...place(label.plate), opacity: label.opacity }}
        />
        {label.key === 'score' ? (
          <Pinned src="/img/opening/title/label-score.avif" box={label.text} />
        ) : (
          <img
            src={`/img/opening/title/label-${label.key}.svg`}
            alt=""
            className="absolute block max-w-none"
            style={place(label.text)}
          />
        )}
      </div>
    ))}

    {TITLE_DECOS.map((deco) => (
      <Pinned
        key={deco.id}
        src={`/img/opening/title/deco-${deco.src}.avif`}
        box={deco.box}
        flipX={deco.flipX}
      />
    ))}

    <TitleLogo />
    <Pinned src="/img/opening/title/clip.avif" box={TITLE_LAYOUT.clip} />

    <img src="/img/opening/title/topbar.avif" alt="" className="absolute block max-w-none" style={TOPBAR} />
    <Pinned src="/img/opening/title/logo-small.avif" box={TITLE_LAYOUT.logoSmall} />

    {/*
      START! — 구조는 ChoiceButton 과 닮았지만 크기도 불투명도도 달라 따로 그린다.
      글자는 Figma 가 Ownglyph MeowWriting 을 쓰는데 파일이 없어 본문 폰트로 대신한다.
    */}
    <button type="button" className="absolute block" style={START} onPointerDown={onStart}>
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
  </main>
)
