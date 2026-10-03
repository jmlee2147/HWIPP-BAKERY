"use client";

import { AnimatePresence, motion } from "motion/react";
import { StepPlaceholder } from "@/components/experience/StepPlaceholder/StepPlaceholder";
import { OpeningScreen } from "@/components/opening/OpeningScreen/OpeningScreen";
import { RelationScreen } from "@/components/questions/RelationScreen/RelationScreen";
import { useIdleReset } from "@/hooks/common/useIdleReset";
import { FIRST_STEP } from "@/lib/steps";
import { coverEnter, holdUntilCovered } from "@/lib/transitions";
import { useExperienceStore } from "@/stores/useExperienceStore";

const IDLE_RESET_MS = 120_000;

export const ExperienceRoot = () => {
  const { step, goNext, goPrev, reset } = useExperienceStore();

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
        {step === FIRST_STEP ? (
          <OpeningScreen />
        ) : step === "relation" ? (
          <RelationScreen />
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
