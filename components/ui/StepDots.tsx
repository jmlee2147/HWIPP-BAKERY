import { type ComponentPropsWithRef } from 'react'

/**
 * 단계 점 표시 — Figma `공용 컴포넌트 / Group 2043688045·046`
 * 두 스타일은 트랙 색만 다르다. 값이 전부 토큰이라 에셋 없이 그린다.
 */

const WIDTH = 111.395
const HEIGHT = 29.204
const DOT_CX = [16.146, 35.919, 55.697, 75.47, 95.248]
const R_ON = 5.97
const R_OFF = 5.823

const TRACK = {
  cream: 'bg-cream',
  dough: 'bg-dough',
} as const

export type StepDotsVariant = keyof typeof TRACK

interface StepDotsProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** 1-based */
  current: number
  variant?: StepDotsVariant
}

export const StepDots = ({ current, variant = 'cream', className, ...props }: StepDotsProps) => (
  <div
    className={`relative rounded-full ${TRACK[variant]} ${className ?? ''}`}
    style={{ width: WIDTH, height: HEIGHT }}
    role="group"
    aria-label={`${DOT_CX.length}단계 중 ${current}단계`}
    {...props}
  >
    {DOT_CX.map((cx, i) => {
      const on = i + 1 === current
      const r = on ? R_ON : R_OFF
      return (
        <span
          key={cx}
          className={`absolute rounded-full ${on ? 'bg-cocoa' : 'bg-sugar'}`}
          style={{
            left: cx - r,
            top: HEIGHT / 2 - r,
            width: r * 2,
            height: r * 2,
          }}
        />
      )
    })}
  </div>
)
