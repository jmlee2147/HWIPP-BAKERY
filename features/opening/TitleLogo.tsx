import type { RefObject } from 'react'
import { LOGO_DROP_DELAY_MS } from '@/components/motion/variants'
import { fromArtboardMeta, unionBox } from '@/lib/config/artboard'
import {
  LOGO_LAYOUT,
  LOGO_STAR_IMAGE,
  LOGO_STAR_TILT,
  LOGO_STAR_WINDOW,
  LOGO_WORDMARK_FONT_SIZE,
} from './script'

const place = fromArtboardMeta
const PLATE = place(LOGO_LAYOUT.plate)
const HEART = place(LOGO_LAYOUT.heart)
const WORDMARK = place(LOGO_LAYOUT.wordmark)
const BAKERY = place(LOGO_LAYOUT.bakery)

/**
 * 글자 겹의 박스. 번짐(`--glow-logo`)이 걸리는 자리라 캔버스 전체로 두지 않는다 —
 * 풀스크린 겹에 filter 와 transform 이 겹치면 합성 텍스처가 14MB 가 된다
 * (`.claude/rules/assets.md` 의 디코딩 메모리 계산).
 */
const GLOW = unionBox([WORDMARK, BAKERY])
const inside = (box: typeof WORDMARK) => ({
  ...box,
  left: box.left - GLOW.left,
  top: box.top - GLOW.top,
})

const WORDMARK_TYPE =
  'absolute flex items-center justify-center whitespace-nowrap font-display text-white'

/** 로고 네 겹은 같은 타이밍으로 함께 떨어진다. 하나라도 어긋나면 로고가 분해되어 보인다. */
const DROP = { animationDelay: `${LOGO_DROP_DELAY_MS}ms` }

interface TitleLogoProps {
  /** 별판을 흘리는 겹. 위치는 `useStarFlow` 가 프레임마다 직접 쓴다. */
  starRef: RefObject<HTMLDivElement | null>
}

/**
 * 타이틀 중앙 로고.
 *
 * 디자이너 메모는 "마우스 갖다대면 로고 뒤 별 배경 사각형 무빙"이지만
 * 터치에는 hover 가 없어 영영 보이지 않는 연출이 된다 (`.claude/rules/project-constraints.md`).
 * 그래서 **누른 쪽으로 계속 흐르게** 했다. 되감기는 별 격자 주기로 일어나 보이지 않는다
 * (`components/motion/useStarFlow.ts`).
 *
 * 판·하트·BAKERY 는 간판 로고(`SignLogo`)와 같은 그림을 크기만 바꿔 쓴다.
 * 간판 쪽은 흰 면 위라 `hard-light` 를 걸지만 여기는 별판 위라 그대로 얹는다.
 */
export const TitleLogo = ({ starRef }: TitleLogoProps) => (
  <>
    {/* 별판. 창 밖으로 넘치는 그림을 창 안에서 흘린다. 겹마다 역할이 하나씩이다. */}
    <div className="absolute animate-logo-drop" style={{ ...LOGO_STAR_WINDOW, ...DROP }}>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ transform: `rotate(${LOGO_STAR_TILT}deg)` }}
      >
        <div ref={starRef} className="absolute inset-0">
          <img
            src="/img/opening/title/logo-stars.avif"
            alt=""
            className="absolute block max-w-none"
            style={LOGO_STAR_IMAGE}
          />
        </div>
      </div>
    </div>

    <img
      src="/img/opening/title/logo-plate.avif"
      alt=""
      className="absolute block max-w-none animate-logo-drop"
      style={{ ...PLATE, ...DROP, filter: 'drop-shadow(var(--shadow-logo-plate))' }}
    />
    <img
      src="/img/opening/sign-heart.svg"
      alt=""
      className="absolute block max-w-none animate-logo-drop"
      style={{ ...HEART, ...DROP }}
    />
    {/* 번짐은 글자와 BAKERY 를 함께 감싸는 그룹에 걸린다 (Figma `Group 2043687975`). */}
    <div className="absolute animate-logo-drop" style={{ ...GLOW, ...DROP, filter: 'var(--glow-logo)' }}>
      {/*
        외곽선 겹. `paint-order: stroke fill` 로 획을 글자 뒤로 보내는 방법은
        Chromium 123 부터라 타깃 108 에서 무효다 — 개발 맥에서만 맞게 보이고 실기는 달라진다.
        그래서 두께를 두 배로 준 겹을 뒤에 깔고 글자를 그 위에 덮는다. 결과가 같고 108 에서 동작한다.
      */}
      <div
        aria-hidden="true"
        className={WORDMARK_TYPE}
        style={{
          ...inside(WORDMARK),
          fontSize: LOGO_WORDMARK_FONT_SIZE,
          WebkitTextStroke: 'var(--text-stroke-logo)',
        }}
      >
        Hwipp!
      </div>
      <div
        className={WORDMARK_TYPE}
        style={{ ...inside(WORDMARK), fontSize: LOGO_WORDMARK_FONT_SIZE }}
      >
        Hwipp!
      </div>
      <img
        src="/img/opening/sign-bakery.svg"
        alt=""
        className="absolute block max-w-none"
        style={inside(BAKERY)}
      />
    </div>
  </>
)
