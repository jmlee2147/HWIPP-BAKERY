import { type ComponentPropsWithRef } from 'react'

/**
 * 좌우 이동 화살표 — Figma `공용 컴포넌트 / Component 30`
 * 에셋은 왼쪽 방향 하나뿐이라 오른쪽은 뒤집어 쓴다.
 */

const SIZE = 97.695

interface NavArrowProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  direction: 'prev' | 'next'
}

export const NavArrow = ({ direction, className, type = 'button', ...props }: NavArrowProps) => (
  <button
    type={type}
    aria-label={direction === 'prev' ? '이전' : '다음'}
    className={`relative block drop-shadow-window ${className ?? ''}`}
    style={{ width: SIZE, height: SIZE }}
    {...props}
  >
    <img
      src="/img/ui/arrow.svg"
      alt=""
      className="absolute inset-0 block h-full w-full max-w-none"
      style={{ transform: direction === 'next' ? 'scaleX(-1)' : undefined }}
    />
  </button>
)
