import type { CSSProperties } from 'react'
import { fromArtboardMeta, type MetaBox, type ScreenBox } from '@/lib/config/artboard'
import { ASSET_SCALE } from './script'

interface PinnedProps {
  src: string
  box: MetaBox
  className?: string
  style?: CSSProperties
  /** 좌우 반전. 같은 그림이 뒤집혀 두 번 쓰일 때 파일을 하나만 둔다. */
  flipX?: boolean
  /** 내보내기 바운딩 보정. `script.ts` 의 NUDGE 주석 참고. */
  nudge?: { x: number; y: number }
  /** 그룹 안에 놓일 때 그룹 박스의 좌상단. 캔버스 좌표를 그룹 기준으로 옮긴다. */
  origin?: Pick<ScreenBox, 'left' | 'top'>
}

/**
 * 노드 자리에 에셋을 **중심만 맞춰** 얹는다.
 *
 * Figma 내보내기는 그림자까지 포함해 노드 박스보다 조금 크다(2.00~2.29x).
 * 박스에 억지로 맞추면 그림이 눌리므로 원본 비율을 지키고 중심을 맞춘다.
 * 크기를 코드에 적지 않아도 되게 CSS 로 처리한다 — 에셋을 다시 받아도 코드는 그대로다.
 */
export const Pinned = ({ src, box, className, style, flipX = false, nudge, origin }: PinnedProps) => {
  const seat = fromArtboardMeta(box)
  return (
    <div
      className={`absolute ${className ?? ''}`}
      style={{
        ...seat,
        left: seat.left + (nudge?.x ?? 0) - (origin?.left ?? 0),
        top: seat.top + (nudge?.y ?? 0) - (origin?.top ?? 0),
        ...style,
      }}
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
