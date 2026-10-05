"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ComponentType } from "react";
import { AnalysisScreen } from "@/components/analysis/AnalysisScreen/AnalysisScreen";
import { StepPlaceholder } from "@/components/experience/StepPlaceholder/StepPlaceholder";
import { OpeningScreen } from "@/components/opening/OpeningScreen/OpeningScreen";
import { FlavorScreen } from "@/components/questions/FlavorScreen/FlavorScreen";
import { PartyScreen } from "@/components/questions/PartyScreen/PartyScreen";
import { RelationScreen } from "@/components/questions/RelationScreen/RelationScreen";
import { StyleScreen } from "@/components/questions/StyleScreen/StyleScreen";
import { ResultScreen } from "@/components/result/ResultScreen/ResultScreen";
import { useIdleReset } from "@/hooks/common/useIdleReset";
import { FIRST_STEP, type Step } from "@/lib/steps";
import { coverEnter, holdUntilCovered } from "@/lib/transitions";
import { useExperienceStore } from "@/stores/useExperienceStore";

const IDLE_RESET_MS = 120_000;

// 구현이 끝난 단계의 화면. 여기에 없는 단계는 임시 화면으로 이어 준다.
const SCREENS: Partial<Record<Step, ComponentType>> = {
  opening: OpeningScreen,
  relation: RelationScreen,
  style: StyleScreen,
  party: PartyScreen,
  flavor: FlavorScreen,
  analysis: AnalysisScreen,
  result: ResultScreen,
};

export const ExperienceRoot = () => {
  const { step, goNext, goPrev, reset } = useExperienceStore();

  const Screen = SCREENS[step];

  useIdleReset(IDLE_RESET_MS, reset, step !== FIRST_STEP);

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={step}
        className="absolute inset-0"
        initial={coverEnter.initial}
        animate={coverEnter.animate}
        exit={holdUntilCovered}
      >
        {Screen ? (
          <Screen />
        ) : (
          <StepPlaceholder
            step={step}
            onNext={goNext}
            onPrev={goPrev}
            onReset={reset}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
