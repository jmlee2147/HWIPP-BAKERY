import { type ComponentPropsWithRef } from 'react'

/** 진행률 바 — Figma `공용 컴포넌트 / Component 13` */

export type ProgressStep = 1 | 2 | 3 | 4 | 5 | 'complete'

/** Figma 에 텍스트 스타일로 정의된 건 `본문` 뿐이라, 이 컴포넌트 전용 값은 여기 모아 둔다. */
const TEXT = {
  heart: { fontSize: 36.629 },
  label: { fontSize: 28.759, lineHeight: '45.906px', letterSpacing: '-0.025em' },
} as const

/**
 * 단계별 위치. Figma inset 실측값을 그대로 쓴다.
 * 노브와 라벨은 채움 끝에 중앙 정렬되므로 left/right 만 있으면 된다.
 */
const GEOMETRY: Record<ProgressStep, { fillRight: string; knob: [string, string]; label: [string, string] }> = {
  1: { fillRight: '79.04%', knob: ['17.31%', '75.95%'], label: ['13.01%', '71.69%'] },
  2: { fillRight: '65.49%', knob: ['30.85%', '62.41%'], label: ['26.55%', '58.15%'] },
  3: { fillRight: '48.4%', knob: ['47.19%', '46.07%'], label: ['42.89%', '41.81%'] },
  4: { fillRight: '34.53%', knob: ['62.03%', '31.23%'], label: ['57.83%', '26.86%'] },
  5: { fillRight: '18.3%', knob: ['77.94%', '15.32%'], label: ['73.64%', '11.06%'] },
  complete: { fillRight: '8.92%', knob: ['87.78%', '5.94%'], label: ['81.66%', '0'] },
}

const SIZE = { width: 930.246, height: 154.063 }
const COMPLETE_SIZE = { width: 998, height: 154 }

interface ProgressBarProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  step: ProgressStep
}

export const ProgressBar = ({ step, className, ...props }: ProgressBarProps) => {
  const isComplete = step === 'complete'
  const g = GEOMETRY[step]
  const size = isComplete ? COMPLETE_SIZE : SIZE

  return (
    <div
      className={`relative ${className ?? ''}`}
      style={size}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={6}
      aria-valuenow={isComplete ? 6 : step}
      {...props}
    >
      {/* 트랙 */}
      <div
        className="absolute rounded-full border-2 border-track-line bg-mint"
        style={{ top: '9.24%', bottom: '68.84%', left: 0, right: isComplete ? '6.79%' : 0 }}
      />

      {/* 채움 */}
      <div
        className="absolute rounded-full border-2 border-fill-line"
        style={{
          top: '9.09%',
          bottom: '68.84%',
          left: 0,
          right: g.fillRight,
          backgroundImage: isComplete
            ? 'linear-gradient(90deg, var(--color-berry) 0%, var(--color-glaze) 48.6%, var(--color-petal) 92.6%)'
            : 'linear-gradient(90deg, var(--color-berry) 0%, transparent 133%)',
        }}
      />

      {/* 노브 — 하트가 박힌 원 */}
      <div
        className="absolute grid place-items-center"
        style={{ top: 0, bottom: '59.3%', left: g.knob[0], right: g.knob[1] }}
      >
        <img
          src={isComplete ? '/img/ui/progress-knob-done.svg' : '/img/ui/progress-knob.svg'}
          alt=""
          className="absolute inset-0 block h-full w-full max-w-none"
        />
        <span
          className={`relative leading-none ${isComplete ? 'text-white' : 'text-cocoa'}`}
          style={TEXT.heart}
        >
          ♥
        </span>
      </div>

      {/* 라벨 말풍선 */}
      <div
        className="absolute"
        style={{ top: '34.21%', bottom: 0, left: g.label[0], right: g.label[1] }}
      >
        <img
          src={isComplete ? '/img/ui/progress-label-done.svg' : '/img/ui/progress-label.svg'}
          alt=""
          className="absolute inset-0 block h-full w-full max-w-none"
        />
        {/*
          텍스트는 말풍선 전체가 아니라 꼬리를 뺀 네모 안에서 중앙이다.
          Figma 텍스트 inset(컨테이너 기준 top 65.37% / bottom 4.77%)을 라벨 기준으로 환산한 값.
        */}
        <span
          className="absolute grid place-items-center font-display text-cocoa"
          style={{ top: '47.36%', bottom: '7.25%', left: 0, right: 0, ...TEXT.label }}
        >
          {isComplete ? 'complete!' : `step.${step}`}
        </span>
      </div>
    </div>
  )
}
