import { ArrowButton } from "@/components/common/ArrowButton/ArrowButton";
import { ChoiceButton } from "@/components/common/ChoiceButton/ChoiceButton";
import {
  ProgressBar,
  type ProgressStep,
} from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { STEP_LABELS, STEPS, type Step } from "@/lib/steps";

interface StepPlaceholderProps {
  step: Step;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
}

// 임시 화면에서 공용 컴포넌트를 확인하기 위한 대응이다. 실제 대응은 각 화면을 구현할 때 정한다.
const PROGRESS: Record<Step, ProgressStep | null> = {
  opening: null,
  relation: 1,
  style: 2,
  party: 3,
  flavor: 4,
  analysis: 5,
  result: "complete",
  editor: "complete",
  share: "complete",
};

// 각 단계 화면이 구현되기 전까지 흐름을 이어 주는 임시 화면.
export const StepPlaceholder = ({
  step,
  onNext,
  onPrev,
  onReset,
}: StepPlaceholderProps) => {
  const index = STEPS.indexOf(step);
  const isFirst = index === 0;
  const isLast = index === STEPS.length - 1;
  const progress = PROGRESS[step];

  return (
    <section className="relative flex h-full flex-col items-center justify-center gap-[48px] bg-[#fbe9ee]">
      {progress !== null && (
        <ProgressBar
          step={progress}
          className="absolute left-[75px] top-[96px]"
        />
      )}
      <SpeechBubble>
        <p>
          {index + 1} / {STEPS.length}
        </p>
        <h1>{STEP_LABELS[step]}</h1>
      </SpeechBubble>
      <ChoiceButton tone={isLast ? "pink" : "mint"} onClick={onReset}>
        처음으로
      </ChoiceButton>
      <div className="flex gap-[24px]">
        <ArrowButton direction="prev" onClick={onPrev} disabled={isFirst} />
        <ArrowButton direction="next" onClick={onNext} disabled={isLast} />
      </div>
    </section>
  );
};
