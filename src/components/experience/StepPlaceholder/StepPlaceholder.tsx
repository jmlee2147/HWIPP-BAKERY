import { STEP_LABELS, STEPS, type Step } from "@/lib/steps";

interface StepPlaceholderProps {
  step: Step;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
}

const buttonClass =
  "h-[120px] rounded-[24px] bg-[#4a2c2a] px-[56px] text-[40px] font-bold text-white disabled:opacity-30";

// 각 단계 화면이 시안대로 구현되기 전까지 흐름을 이어 주는 임시 화면.
export const StepPlaceholder = ({
  step,
  onNext,
  onPrev,
  onReset,
}: StepPlaceholderProps) => {
  const index = STEPS.indexOf(step);
  const isFirst = index === 0;
  const isLast = index === STEPS.length - 1;

  return (
    <section className="flex h-full flex-col items-center justify-center gap-[64px] bg-[#fbe9ee] text-[#4a2c2a]">
      <p className="text-[40px]">
        {index + 1} / {STEPS.length}
      </p>
      <h1 className="text-[96px] font-bold">{STEP_LABELS[step]}</h1>
      <div className="flex gap-[32px]">
        <button
          type="button"
          className={buttonClass}
          onClick={onPrev}
          disabled={isFirst}
        >
          이전
        </button>
        {isLast ? (
          <button type="button" className={buttonClass} onClick={onReset}>
            처음으로
          </button>
        ) : (
          <button type="button" className={buttonClass} onClick={onNext}>
            다음
          </button>
        )}
      </div>
    </section>
  );
};
