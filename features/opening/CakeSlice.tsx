import { SLICE_POP_STEP_MS } from '@/components/motion/variants'
import { fromArtboardMeta, unionBox, type ScreenBox } from '@/lib/config/artboard'
import { Pinned } from './Pinned'
import type { CakeSlice as CakeSliceData, CakeStar } from './script'

/** 별은 중심으로 선언되어 있다. 회전 전 자리를 잡고 회전은 `transform` 이 한다. */
const starSeat = (star: CakeStar): ScreenBox => ({
  left: star.center.x - star.width / 2,
  top: star.center.y - star.height / 2,
  width: star.width,
  height: star.height,
})

const sliceSeat = ({ box, nudge }: CakeSliceData): ScreenBox => {
  const seat = fromArtboardMeta(box)
  return { ...seat, left: seat.left + (nudge?.x ?? 0), top: seat.top + (nudge?.y ?? 0) }
}

/** 케이크와 별을 감싼 박스. 등장 `transform` 의 원점이다. */
export const sliceBounds = (slice: CakeSliceData): ScreenBox =>
  unionBox([sliceSeat(slice), ...(slice.stars ?? []).map(starSeat)])

interface CakeSliceProps {
  slice: CakeSliceData
  /** 진입 순서. 여섯 조각이 한꺼번에 들어오지 않게 한 장씩 늦춘다. */
  index: number
  /** 컷 6 에 들어선 뒤에만 등장 연출을 건다. 클래스가 붙는 순간이 곧 재생 시점이다. */
  popping: boolean
}

/**
 * 케이크 한 조각과 거기 붙은 별을 **한 덩어리로** 띄운다 (컷 6·7).
 *
 * 그룹 박스를 따로 잡는 이유는 `transform` 원점 때문이다 — 조각마다 변형하면 원점이 달라
 * 확대될 때 별이 케이크에서 떨어져 나간다. 박스를 화면 전체가 아니라 케이크에 딱 맞게
 * 잡는 것도 같은 이유가 아니라 합성 비용 때문이다. 이 해상도에서 풀스크린 레이어 한 장이
 * 약 14MB GPU 텍스처다 (`.claude/rules/motion.md`).
 *
 * 컷 1 카드와 달리 앉은 뒤에는 움직이지 않는다. 컷 6·7 은 대사를 읽는 짧은 구간이고
 * 시선은 제빵사에게 가야 한다.
 */
export const CakeSlice = ({ slice, index, popping }: CakeSliceProps) => {
  const bounds = sliceBounds(slice)

  return (
    <div
      className={`absolute ${popping ? 'animate-card-pop' : ''}`}
      style={{ ...bounds, animationDelay: `${index * SLICE_POP_STEP_MS}ms` }}
    >
      <Pinned
        src={`/img/opening/interior/slice-${slice.key}.avif`}
        box={slice.box}
        nudge={slice.nudge}
        origin={bounds}
      />

      {slice.stars?.map((star) => {
        const seat = starSeat(star)
        return (
          <img
            key={`${star.center.x},${star.center.y}`}
            src={star.src}
            alt=""
            className="absolute block max-w-none"
            style={{
              ...seat,
              left: seat.left - bounds.left,
              top: seat.top - bounds.top,
              transform: `rotate(${star.tiltDeg}deg)`,
            }}
          />
        )
      })}
    </div>
  )
}
