# 컴포넌트 가이드

재사용 UI를 만들거나 수정할 때 읽습니다.

## UI 기본값 — 전시물이라 일반 웹 앱과 다릅니다

- **연출이 콘텐츠입니다.** 업무용 대시보드의 "밀도 있고 스캔하기 쉬운" 기준을 적용하지 않습니다.
- 한 화면에 한 가지 일만 시킵니다. 관람객은 2~3분 안에 처음이자 마지막으로 이 화면을 봅니다.
- **모든 어포던스는 정적으로 보여야 합니다.** 터치라서 hover가 없습니다(`project-constraints.md`).
- loading·empty·error 상태를 UI로 만들지 않습니다. 실패는 폴백이나 `idle` 복귀로 끝납니다
  (`operations.md`). 유일한 로딩 표현은 STEP.3의 연출 모션입니다.
- 색상에만 의존해 상태를 표현하지 않습니다. 전시장 조명에서 색 구분이 어려울 수 있습니다.

## 컴포넌트 구조

```tsx
import { type ComponentPropsWithRef } from 'react'
import { tv } from 'tailwind-variants'

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center rounded-full font-medium',
  variants: {
    variant: {
      primary: 'bg-[var(--color-primary)] text-white',
      ghost: 'bg-transparent',
    },
    size: {
      m: 'h-[88px] px-8 text-2xl',
      l: 'h-[112px] px-12 text-3xl',
    },
  },
  defaultVariants: { variant: 'primary', size: 'm' },
})

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'ghost'
  size?: 'm' | 'l'
}

export const Button = ({ variant, size, className, ref, type = 'button', ...props }: ButtonProps) => (
  <button ref={ref} type={type} className={buttonVariants({ variant, size, className })} {...props} />
)
```

### 필수

- `className` prop 항상 노출 — 외부에서 스타일 오버라이드 가능하게
- `ref` prop 항상 노출
- 나머지 props는 `...props`로 전달
- 스타일 변형은 `tailwind-variants`(`tv`)로 관리
- **크기는 Figma 좌표 그대로 px**로 씁니다. rem·%로 환산하지 않습니다(`architecture.md` 고정 캔버스)
- 터치 타겟은 **≥ 88px** — 위 예시의 `size: m`이 최소값입니다

### 네이밍

- 컴포넌트 파일: PascalCase (`Button.tsx`)
- props 타입: `{컴포넌트명}Props` (`ButtonProps`)
- variants: `{컴포넌트명}Variants` (`buttonVariants`)

## 패턴

### Variant pattern

시각 상태는 `tailwind-variants`로 관리합니다. boolean prop을 남발하지 않습니다.
잘못된 조합이 타입 단계에서 걸립니다.

```tsx
export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
```

### Controlled component

**이 프로젝트의 기본값입니다.** 상태는 전부 `lib/session`의 세션 스토어가 갖고,
컴포넌트는 props를 받아 렌더링과 콜백만 합니다(`state-machine.md`).

```tsx
interface TargetPickerProps {
  value: TargetType | null
  onValueChange: (value: TargetType) => void
  items: TargetOption[]
}
```

컴포넌트 안에 `useState`로 선택 상태를 두지 않습니다. 세션 리셋 시 그 상태가 남습니다.

### Slot props

구조는 컴포넌트가 책임지고, 특정 위치 UI만 주입받습니다.

```tsx
<StepLayout title="누구를 위한 케이크인가요?" footer={<Button>다음</Button>} />
```

### 배열 + 설정 객체

**반복 UI는 반드시 데이터 배열로 렌더링합니다.** JSX에 하드코딩하지 않습니다.
문항, 타겟 선택지, 결과 카드 항목이 전부 여기 해당합니다.

```tsx
const TARGETS: TargetOption[] = [
  { key: 'lover', label: '연인', icon: '...' },
  { key: 'bestie', label: '절친', icon: '...' },
]
{TARGETS.map(t => <TargetCard key={t.key} {...t} />)}
```

전시 직전에 선택지가 바뀌어도 컴포넌트를 건드리지 않기 위한 규칙입니다.
데이터 선언 위치는 `features/{step}/` 안에 둡니다.

## 피해야 할 패턴

- 시각 상태를 boolean props로 남발 → variant로 통합
- 컴포넌트 내부 상태 관리 → controlled component로 세션 스토어가 제어
- 모든 조각을 props로 받기 → slot props로 특정 위치만 주입
- JSX에 데이터 하드코딩 → 배열/객체로 렌더링
- 인라인 스타일 → Tailwind `className`
- 하드코딩된 색상 → `app/globals.css`의 CSS 변수(디자인 토큰)
- 컴포넌트 안에서 애니메이션 정의 → `components/motion/` (`motion.md`)
