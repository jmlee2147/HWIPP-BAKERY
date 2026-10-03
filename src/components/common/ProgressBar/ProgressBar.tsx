import type { ComponentPropsWithRef } from "react";

export type ProgressStep = 1 | 2 | 3 | 4 | 5 | "complete";

interface StepLayout {
  fillWidth: number;
  labelWidth: number;
  textSrc: string;
  labelSrc: string;
  fillClass: string;
}

const KNOB_SIZE = 62.71;
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

interface ProgressBarProps extends ComponentPropsWithRef<"div"> {
  step: ProgressStep;
}

export const ProgressBar = ({
  step,
  className = "",
  ...props
}: ProgressBarProps) => {
  const layout = LAYOUTS[step];
  const isComplete = step === "complete";
  const knobLeft = layout.fillWidth - 33.95;
  const labelLeft = knobLeft + KNOB_SIZE / 2 - layout.labelWidth / 2;

  return (
    <div
      role="img"
      aria-label={isComplete ? "완료" : `${step}단계`}
      className={`h-[154.06px] w-[930.25px] ${className}`}
      {...props}
    >
      <div className="relative size-full">
        <div className="absolute left-0 top-[14.24px] h-[33.77px] w-full rounded-[50px] border-2 border-[#d4c7c1] bg-mint" />
        <div
          className={`absolute left-0 top-[14px] h-[34px] rounded-[50px] border-2 border-[#867b76] ${layout.fillClass}`}
          style={{ width: layout.fillWidth }}
        />
        <div
          className="absolute top-0 flex h-[62.71px] w-[62.71px] items-center justify-center"
          style={{ left: knobLeft }}
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
          style={{ left: labelLeft, width: layout.labelWidth }}
        >
          <img
            alt=""
            className="absolute inset-[-2.4%_-0.5%_-0.71%_-0.5%] block h-[103.11%] w-[101%] max-w-none"
            src={layout.labelSrc}
          />
          <img
            alt=""
            className="absolute left-1/2 top-[48px] block max-w-none -translate-x-1/2"
            src={layout.textSrc}
          />
        </div>
      </div>
    </div>
  );
};
