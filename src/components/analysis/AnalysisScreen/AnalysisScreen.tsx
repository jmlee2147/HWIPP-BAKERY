"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LoadingScene } from "@/components/analysis/LoadingScene/LoadingScene";
import { ChoiceButton } from "@/components/common/ChoiceButton/ChoiceButton";
import { DialogScene } from "@/components/opening/DialogScene/DialogScene";
import { CONFIRM, CONFIRM_CHOICE } from "@/data/analysis";
import { coverEnter, holdUntilCovered } from "@/lib/transitions";
import { useExperienceStore } from "@/stores/useExperienceStore";

export type AnalysisScene = "confirm" | "loading";

const LOADING_MS = 8000;

interface AnalysisScreenProps {
  initialScene?: AnalysisScene;
  loadingMs?: number;
}

export const AnalysisScreen = ({
  initialScene = "confirm",
  loadingMs = LOADING_MS,
}: AnalysisScreenProps) => {
  const goNext = useExperienceStore((state) => state.goNext);
  const [scene, setScene] = useState<AnalysisScene>(initialScene);

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={scene}
        className="absolute inset-0"
        initial={coverEnter.initial}
        animate={coverEnter.animate}
        exit={holdUntilCovered}
      >
        {scene === "confirm" ? (
          <DialogScene scene={CONFIRM} progressStep={4}>
            <ChoiceButton
              tone="mint"
              className="absolute left-[62px] top-[1723.6px]"
              onClick={() => setScene("loading")}
            >
              {CONFIRM_CHOICE}
            </ChoiceButton>
          </DialogScene>
        ) : (
          <LoadingScene durationMs={loadingMs} onDone={goNext} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
