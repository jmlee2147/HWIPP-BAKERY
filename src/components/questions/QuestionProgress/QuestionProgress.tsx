"use client";

import type { ComponentPropsWithRef } from "react";
import {
  type MovableStep,
  ProgressBar,
} from "@/components/common/ProgressBar/ProgressBar";
import { furthestQuestionStep, QUESTION_STEPS } from "@/lib/steps";
import { useExperienceStore } from "@/stores/useExperienceStore";

interface QuestionProgressProps extends ComponentPropsWithRef<"div"> {
  step: MovableStep;
}

// 문답 화면의 진행 바. 답한 단계와 아직 답하지 않은 첫 단계 사이를 진행 바로 오갈 수 있다.
export const QuestionProgress = ({ step, ...props }: QuestionProgressProps) => {
  const goTo = useExperienceStore((state) => state.goTo);
  const furthest = useExperienceStore((state) => furthestQuestionStep(state));

  return (
    <ProgressBar
      step={step}
      maxStep={(QUESTION_STEPS.indexOf(furthest) + 1) as MovableStep}
      onSelectStep={(target) => goTo(QUESTION_STEPS[target - 1])}
      {...props}
    />
  );
};
