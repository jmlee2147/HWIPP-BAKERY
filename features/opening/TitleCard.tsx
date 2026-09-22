'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import {
  CARD_FLOAT,
  CARD_POP_DELAY_MS,
  CARD_POP_STEP_MS,
  CARD_TAP,
} from '@/components/motion/variants'
import { fromArtboardMeta, unionBox, type MetaBox, type ScreenBox } from '@/lib/config/artboard'
import { Pinned } from './Pinned'
import type { TitleCard as TitleCardData, TitleCardPart } from './script'

/** 조각이 놓이는 자리. 내보내기 보정(`nudge`)까지 반영한 값이라 그룹 박스도 이걸로 잰다. */
const seatOf = ({ box, nudge }: TitleCardPart): ScreenBox => {
  const seat = fromArtboardMeta(box)
  return { ...seat, left: seat.left + (nudge?.x ?? 0), top: seat.top + (nudge?.y ?? 0) }
}

/** 케이크와 라벨을 감싼 박스. 탭 판정과 `transform` 원점이 같은 값을 쓴다. */
export const cardBounds = (card: TitleCardData): ScreenBox =>
  unionBox([
    ...card.parts.map(seatOf),
    ...card.labels.flatMap((label) => [fromArtboardMeta(label.plate), fromArtboardMeta(label.text)]),
  ])

/**
 * 탭이 카드 중심에서 이 거리 안에 들어와야 반응한다(px).
 *
 * 사각형 히트박스를 쓰지 않는 이유는 케이크가 회전 배치라 **바운딩 박스가 서로 겹치기**
 * 때문이다 — 체리 박스가 딸기 박스를 93px 폭으로 덮어 여백을 눌러도 옆 케이크가 반응했다.
 * 라벨을 빼도 줄지 않는다.
 *
 * 210px 은 가장 큰 카드의 짧은 변 절반(204px)을 덮는 값이다. 반경이 겹치는 카드가 있어도
 * **가장 가까운 한 장만** 고르므로 오판은 생기지 않는다(중심 간 최소 거리 280px, 경계는 그 중간).
 * 반경 밖, 즉 빈 보드를 눌렀을 때는 아무 카드도 반응하지 않는다.
 */
export const CARD_TAP_RADIUS = 210

/** 캔버스 좌표를 그룹 박스 기준으로 옮긴다. */
const inside = (box: MetaBox, origin: ScreenBox): ScreenBox => {
  const seat = fromArtboardMeta(box)
  return { ...seat, left: seat.left - origin.left, top: seat.top - origin.top }
}

interface TitleCardProps {
  card: TitleCardData
  /** 진입 순서. 카드가 한꺼번에 들어오지 않게 한 장씩 늦춘다. */
  index: number
  /** 이 카드가 눌린 횟수. 값이 바뀔 때마다 한 번 튄다. 판정은 `TitleScene` 이 한다. */
  tapSeq: number
}

/**
 * 케이크 한 장과 거기 붙은 라벨을 **한 덩어리로** 띄운다.
 *
 * 그룹 박스를 따로 잡는 이유는 `transform` 의 원점 때문이다 — 조각마다 변형하면
 * 원점이 달라 기울일 때 라벨이 케이크에서 떨어져 나간다.
 * 겹은 바깥부터 진입(한 번) · 상시 부유 · 탭 반응이다. 한 요소에 몰면 뒤 것이 앞 것을 덮어쓴다.
 */
export const TitleCard = ({ card, index, tapSeq }: TitleCardProps) => {
  const tapRef = useRef<HTMLDivElement>(null)
  const bounds = cardBounds(card)
  const float = CARD_FLOAT[card.key]

  /**
   * 눌린 케이크가 말랑하게 한 번 부푼다. 눌러도 아무 일이 없으면 관람객은 화면이 멈춘 줄 안다.
   *
   * 오버슈트를 쓰지 않는다 — 되돌아올 때 한 번 더 꺾이면 움찔거려 고장처럼 보인다.
   * 커지는 구간만 빠르게 가서 손가락에 붙는 느낌을 남기고 길게 가라앉는다.
   *
   * CSS 클래스가 아니라 스크립트로 재생한다 — 같은 카드를 연달아 누를 때
   * 클래스만 다시 붙이면 애니메이션이 처음부터 돌지 않는다.
   */
  useEffect(() => {
    const node = tapRef.current
    if (tapSeq === 0 || !node) return

    const ease = (token: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(token).trim() || 'ease-out'
    const tilt = Math.sign(float.tiltDeg) * CARD_TAP.tiltDeg

    for (const running of node.getAnimations()) running.cancel()
    node.animate(
      [
        { transform: 'scale(1) rotate(0deg)', easing: ease('--ease-enter') },
        {
          transform: `scale(${CARD_TAP.popScale}) rotate(${tilt}deg)`,
          offset: CARD_TAP.peakOffset,
          easing: ease('--ease-move'),
        },
        { transform: 'scale(1) rotate(0deg)' },
      ],
      { duration: CARD_TAP.durationMs },
    )
  }, [tapSeq, float.tiltDeg])

  return (
    <div
      className="absolute animate-card-pop"
      style={{ ...bounds, animationDelay: `${CARD_POP_DELAY_MS + index * CARD_POP_STEP_MS}ms` }}
    >
      <div
        className="absolute inset-0 animate-card-float"
        style={
          {
            '--float-dur': `${float.durationMs}ms`,
            '--float-delay': `${float.delayMs}ms`,
            '--float-rise': `${float.riseY}px`,
            '--float-drift': `${float.driftX}px`,
            '--float-tilt': `${float.tiltDeg}deg`,
          } as CSSProperties
        }
      >
        <div ref={tapRef} className="absolute inset-0">
          {card.parts.map((part) => (
            <Pinned
              key={part.key}
              src={`/img/opening/title/cake-${part.key}.avif`}
              box={part.box}
              nudge={part.nudge}
              origin={bounds}
            />
          ))}

          {card.labels.map((label) => (
            <div key={label.key}>
              <div
                className="absolute border-[0.675px] border-cocoa bg-cream"
                style={{ ...inside(label.plate, bounds), opacity: label.opacity }}
              />
              {label.key === 'score' ? (
                <Pinned src="/img/opening/title/label-score.avif" box={label.text} origin={bounds} />
              ) : (
                <img
                  src={`/img/opening/title/label-${label.key}.svg`}
                  alt=""
                  className="absolute block max-w-none"
                  style={inside(label.text, bounds)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
