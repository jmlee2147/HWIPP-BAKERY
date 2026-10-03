"use client";

import { AnimatePresence, motion } from "motion/react";
import { StepPlaceholder } from "@/components/experience/StepPlaceholder/StepPlaceholder";
import { useIdleReset } from "@/hooks/common/useIdleReset";
import { FIRST_STEP } from "@/lib/steps";
import { useExperienceStore } from "@/stores/useExperienceStore";

const IDLE_RESET_MS = 120_000;

export const ExperienceRoot = () => {
  const { step, goNext, goPrev, reset } = useExperienceStore();

  useIdleReset(IDLE_RESET_MS, reset, step !== FIRST_STEP);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <StepPlaceholder
          step={step}
          onNext={goNext}
          onPrev={goPrev}
          onReset={reset}
        />
      </motion.div>
    </AnimatePresence>
  );
};
