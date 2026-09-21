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

const VARIANT = {
  blush: 'bg-blush',
  mint: 'bg-mint',
} as const

type Variant = keyof typeof VARIANT

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: Variant
}

export const Button = ({ variant = 'blush', className, ref, type = 'button', ...props }: ButtonProps) => (
  <button ref={ref} type={type} className={`... ${VARIANT[variant]} ${className ?? ''}`} {...props} />
)
```

### 필수

- `className` prop 항상 노출 — 외부에서 스타일 오버라이드 가능하게
- `ref` prop 항상 노출
- 나머지 props는 `...props`로 전달
- 스타일 변형은 **객체 맵**으로 관리합니다 (`as const` + `keyof typeof`)
- **크기는 Figma 좌표 그대로 px**로 씁니다. rem·%로 환산하지 않습니다(`architecture.md` 고정 캔버스)
- 터치 타겟은 **≥ 88px** — 위 예시의 `size: m`이 최소값입니다

### 네이밍

- 컴포넌트 파일: PascalCase (`Button.tsx`)
- props 타입: `{컴포넌트명}Props` (`ButtonProps`)
- variants: `{컴포넌트명}Variants` (`buttonVariants`)

## 패턴

### Variant pattern

시각 상태는 **객체 맵**으로 관리합니다. boolean prop을 남발하지 않습니다.
`keyof typeof` 로 타입을 뽑으면 잘못된 값이 타입 단계에서 걸립니다.

```tsx
const VARIANT = { blush: 'bg-blush', mint: 'bg-mint' } as const
export type ChoiceVariant = keyof typeof VARIANT
```

**`tailwind-variants` 같은 라이브러리를 쓰지 않습니다.** 변형 축이 하나뿐이라 객체 맵으로 충분하고,
의존성을 늘릴 이유가 없습니다. 축이 2개 이상으로 늘고 조합 규칙이 생기면 그때 도입을 검토합니다
(의존성 추가는 확인을 받습니다 — `project-constraints.md`).

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

- 시각 상태를 boolean props로 남발 → variant 맵으로 통합
- 컴포넌트 내부 상태 관리 → controlled component로 세션 스토어가 제어
- 모든 조각을 props로 받기 → slot props로 특정 위치만 주입
- JSX에 데이터 하드코딩 → 배열/객체로 렌더링
- 인라인 스타일 → Tailwind `className`
- 하드코딩된 색상 → `app/globals.css`의 CSS 변수(디자인 토큰)
- 컴포넌트 안에서 애니메이션 정의 → `components/motion/` (`motion.md`)
