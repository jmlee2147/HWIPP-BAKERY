"use client";

import { type ComponentPropsWithRef, useRef, useState } from "react";

export type ProgressStep = 1 | 2 | 3 | 4 | 5 | "complete";
// 진행 바로 오갈 수 있는 단계. 문답 네 단계다.
export type MovableStep = 1 | 2 | 3 | 4;

interface StepLayout {
  fillWidth: number;
  labelWidth: number;
  textSrc: string;
  labelSrc: string;
  fillClass: string;
}

const KNOB_SIZE = 62.71;
const BAR_WIDTH = 930.25;
const DEFAULT_FILL =
  "bg-[linear-gradient(90deg,theme(colors.candy)_0%,rgba(255,255,255,0)_133%)]";

// 단계별 채움 너비. 손잡이와 이름표는 채움 끝을 따라간다.
const LAYOUTS: Record<ProgressStep, StepLayout> = {
  1: {
    fillWidth: 194.98,
    labelWidth: 142.33,
    textSrc: "/assets/ui/progress/text-step-1.svg",
    labelSrc: "/assets/ui/progress/label.svg",
    fillClass: DEFAULT_FILL,
  },
  2: {
    fillWidth: 321.03,
    labelWidth: 142.33,
    textSrc: "/assets/ui/progress/text-step-2.svg",
    labelSrc: "/assets/ui/progress/label.svg",
    fillClass: DEFAULT_FILL,
  },
  3: {
    fillWidth: 480,
    labelWidth: 142.33,
    textSrc: "/assets/ui/progress/text-step-3.svg",
    labelSrc: "/assets/ui/progress/label.svg",
    fillClass: DEFAULT_FILL,
  },
  4: {
    fillWidth: 609.03,
    labelWidth: 142.33,
    textSrc: "/assets/ui/progress/text-step-4.svg",
    labelSrc: "/assets/ui/progress/label.svg",
    fillClass: DEFAULT_FILL,
  },
  5: {
    fillWidth: 760,
    labelWidth: 142.33,
    textSrc: "/assets/ui/progress/text-step-5.svg",
    labelSrc: "/assets/ui/progress/label.svg",
    fillClass:
      "bg-[linear-gradient(90deg,theme(colors.candy)_12.735%,rgba(255,255,255,0)_126.21%)]",
  },
  complete: {
    fillWidth: 908.98,
    labelWidth: 183.03,
    textSrc: "/assets/ui/progress/text-complete.svg",
    labelSrc: "/assets/ui/progress/label-complete.svg",
    fillClass:
      "bg-[linear-gradient(90deg,theme(colors.candy)_0%,#fffcf3_48.555%,#ffd1e9_92.567%)]",
  },
};

// 손잡이 가운데가 놓이는 자리. 손잡이는 채움 끝에서 33.95px 안쪽에서 시작한다.
const knobLeftOf = (fillWidth: number) => fillWidth - 33.95;
const knobCenterOf = (step: ProgressStep) =>
  knobLeftOf(LAYOUTS[step].fillWidth) + KNOB_SIZE / 2;

const MOVABLE_STEPS: MovableStep[] = [1, 2, 3, 4];

interface ProgressBarProps extends ComponentPropsWithRef<"div"> {
  step: ProgressStep;
  // 이 값을 주면 손잡이를 끌거나 단계 자리를 눌러 1단계부터 maxStep까지 오갈 수 있다.
  // 손을 떼면 가장 가까운 단계에 붙는다.
  onSelectStep?: (step: MovableStep) => void;
  maxStep?: MovableStep;
}

export const ProgressBar = ({
  step,
  onSelectStep,
  maxStep = 1,
  className = "",
  ...props
}: ProgressBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  // 끄는 동안 손잡이 가운데가 놓인 자리. 끌고 있지 않으면 null이다.
  const [dragX, setDragX] = useState<number | null>(null);

  const reachable = MOVABLE_STEPS.filter((item) => item <= maxStep);
  const nearestStep = (x: number) =>
    reachable.reduce((best, item) =>
      Math.abs(knobCenterOf(item) - x) < Math.abs(knobCenterOf(best) - x)
        ? item
        : best,
    );
  // 화면 배율과 상관없이 진행 바 안의 좌표로 바꾸고, 갈 수 있는 범위 안으로 묶는다.
  const toBarX = (clientX: number) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return knobCenterOf(step);
    const x = ((clientX - rect.left) * BAR_WIDTH) / rect.width;
    return Math.min(
      Math.max(x, knobCenterOf(1)),
      knobCenterOf(reachable[reachable.length - 1]),
    );
  };

  const shownStep = dragX === null ? step : nearestStep(dragX);
  const layout = LAYOUTS[step];
  const shownLayout = LAYOUTS[shownStep];
  const isComplete = step === "complete";
  const knobLeft = knobLeftOf(layout.fillWidth);
  const labelLeft = knobLeft + KNOB_SIZE / 2 - layout.labelWidth / 2;
  // 끄는 동안에는 손잡이와 이름표만 손가락을 따라 옮긴다.
  const dragShift = dragX === null ? 0 : dragX - knobCenterOf(step);

  return (
    <div className={`h-[154.06px] w-[930.25px] ${className}`} {...props}>
      <div ref={barRef} className="relative size-full">
        {/* 그림으로 된 진행 바를 화면을 읽어 주는 도구가 읽도록 글로도 둔다. */}
        <p className="sr-only">{isComplete ? "완료" : `${step}단계`}</p>
        <div className="absolute left-0 top-[14.24px] h-[33.77px] w-full rounded-[50px] border-2 border-[#d4c7c1] bg-mint" />
        <div
          className={`absolute left-0 top-[14px] h-[34px] overflow-hidden rounded-[50px] border-2 border-[#867b76] ${layout.fillClass}`}
          style={{ width: layout.fillWidth }}
        >
          {/* 채움 위를 오가는 빛. 그라데이션이 일렁이는 것처럼 보인다. */}
          <div className="absolute inset-y-0 left-0 w-[60%] animate-shimmer motion-reduce:hidden bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.75)_50%,rgba(255,255,255,0)_100%)]" />
        </div>
        <div
          className="absolute top-0 flex h-[62.71px] w-[62.71px] items-center justify-center"
          style={{ left: knobLeft, transform: `translateX(${dragShift}px)` }}
        >
          <img
            alt=""
            className="absolute inset-0 size-full max-w-none"
            src={
              isComplete
                ? "/assets/ui/progress/knob-complete.svg"
                : "/assets/ui/progress/knob.svg"
            }
          />
          <span
            aria-hidden
            className={`relative font-stardust text-[36.63px] leading-none ${isComplete ? "text-white" : "text-cocoa"}`}
          >
            ♥
          </span>
        </div>
        <div
          className="absolute top-[52.7px] h-[101.36px]"
          style={{
            left: labelLeft,
            width: layout.labelWidth,
            transform: `translateX(${dragShift}px)`,
          }}
        >
          <img
            alt=""
            className="absolute inset-[-2.4%_-0.5%_-0.71%_-0.5%] block h-[103.11%] w-[101%] max-w-none"
            src={shownLayout.labelSrc}
          />
          <img
            alt=""
            className="absolute left-1/2 top-[48px] block max-w-none -translate-x-1/2"
            src={shownLayout.textSrc}
          />
        </div>
        {onSelectStep && (
          <>
            {/* 막대 둘레의 88px 높이를 끌거나 누르는 영역으로 쓴다. */}
            <div
              aria-hidden
              data-testid="progress-track"
              className="absolute inset-x-0 top-[-13px] h-[88px] touch-none"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture?.(event.pointerId);
                setDragX(toBarX(event.clientX));
              }}
              onPointerMove={(event) => {
                if (dragX !== null) setDragX(toBarX(event.clientX));
              }}
              onPointerUp={(event) => {
                if (dragX === null) return;
                const target = nearestStep(toBarX(event.clientX));
                setDragX(null);
                if (target !== step) onSelectStep(target);
              }}
              onPointerCancel={() => setDragX(null)}
            />
            {reachable
              .filter((item) => item !== step)
              .map((item) => (
                <button
                  key={item}
                  type="button"
                  className="sr-only"
                  onClick={() => onSelectStep(item)}
                >
                  {`${item}단계로 이동`}
                </button>
              ))}
          </>
        )}
      </div>
    </div>
  );
};
