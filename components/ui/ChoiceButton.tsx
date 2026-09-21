import { type ComponentPropsWithRef, type ReactNode } from 'react'

/** 선택지 버튼 — Figma `공용 컴포넌트 / Group 2043688094·095` */

const WIDTH = 957
const HEIGHT = 133.15

/** 좌우 2개씩, 총 4개. inset 은 Figma 실측값. */
const STARS = ['4.02%', '8.39%', '88.42%', '92.79%'] as const
const STAR_BOX = '3.36%'
/** SVG 바운딩 박스가 노드 박스보다 크다. 교체 요소는 inset 만으로 크기가 안 정해져 명시한다. */
const STAR_IMG = { width: 39.579, height: 38.08, top: '-13.87%', left: '-11.42%' }

const VARIANT = {
  blush: 'bg-blush',
  mint: 'bg-mint',
} as const

export type ChoiceVariant = keyof typeof VARIANT

interface ChoiceButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  variant?: ChoiceVariant
  children: ReactNode
}

export const ChoiceButton = ({
  variant = 'blush',
  children,
  className,
  type = 'button',
  ...props
}: ChoiceButtonProps) => (
  <button
    type={type}
    className={`relative block ${className ?? ''}`}
    style={{ width: WIDTH, height: HEIGHT }}
    {...props}
  >
    {/* 바깥 판 */}
    <div
      className="absolute inset-0 rounded-[8.52px] bg-plate opacity-70"
      style={{ boxShadow: 'var(--shadow-plate)' }}
    />

    {/* 안쪽 면 — 여기서 색이 갈린다 */}
    <div
      className="absolute rounded-[8.52px] border-[0.341px] border-plate-line opacity-60"
      style={{ top: '4.31%', bottom: '4.32%', left: '0.94%', right: '0.94%' }}
    >
      <div className={`absolute inset-0 rounded-[8.52px] ${VARIANT[variant]}`} />
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{ boxShadow: 'var(--shadow-plate-inset)' }}
      />
    </div>

    {/* 별 장식 */}
    {STARS.map((left) => (
      <div
        key={left}
        className="absolute"
        style={{ top: '37.66%', bottom: '38.14%', left, width: STAR_BOX }}
      >
        <img src="/img/ui/star-small.svg" alt="" className="absolute block max-w-none" style={STAR_IMG} />
      </div>
    ))}

    {/* 문구. Figma 박스는 세로 중앙이 아니라 위쪽으로 치우쳐 있다. */}
    <span
      className="absolute grid place-items-center whitespace-nowrap text-body text-cocoa"
      style={{ top: '32.13%', bottom: '42.33%', left: '26%', right: '26%', lineHeight: '34px' }}
    >
      {children}
    </span>
  </button>
)
