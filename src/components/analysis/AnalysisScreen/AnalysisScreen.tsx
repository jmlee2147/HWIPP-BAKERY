"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { LoadingScene } from "@/components/analysis/LoadingScene/LoadingScene";
import { ChoiceButton } from "@/components/common/ChoiceButton/ChoiceButton";
import { DialogScene } from "@/components/opening/DialogScene/DialogScene";
import { CONFIRM, CONFIRM_CHOICE } from "@/data/analysis";
import type { CakeConfig } from "@/data/cake";
import { FLAVORS } from "@/data/flavors";
import { PARTIES } from "@/data/parties";
import { RELATIONS } from "@/data/relations";
import { RESULT_IMAGES } from "@/data/result";
import { STYLES } from "@/data/styles";
import { pickCake } from "@/lib/analysis";
import { cakeLayers } from "@/lib/cake";
import { nextOrderNumber } from "@/lib/order";
import { preloadImages } from "@/lib/preload";
import { coverEnter, holdUntilCovered } from "@/lib/transitions";
import { useExperienceStore } from "@/stores/useExperienceStore";

export type AnalysisScene = "confirm" | "loading";

const LOADING_MS = 8000;

interface AnalysisScreenProps {
  initialScene?: AnalysisScene;
  loadingMs?: number;
}

// 지금까지의 문답 답변으로 고른 케이크.
function chosenCake(): CakeConfig {
  const { relation, style, party, flavor } = useExperienceStore.getState();
  // 문답을 건너뛰고 들어온 경우에도 멈추지 않도록 빈 답변은 첫 선택지로 채운다.
  return pickCake({
    relation: relation ?? RELATIONS[0].id,
    style: style ?? STYLES[0].id,
    party: party ?? PARTIES[0].id,
    flavor: flavor ?? FLAVORS[0].id,
  });
}

export const AnalysisScreen = ({
  initialScene = "confirm",
  loadingMs = LOADING_MS,
}: AnalysisScreenProps) => {
  const [scene, setScene] = useState<AnalysisScene>(initialScene);

  // 답변이 같으면 늘 같은 케이크가 나오므로, 결과 화면에서 쓸 그림을 로딩이 끝나기 전에 받아 둔다.
  useEffect(() => {
    preloadImages([
      ...RESULT_IMAGES,
      ...cakeLayers(chosenCake()).map((item) => item.src),
    ]);
  }, []);

  // 로딩이 끝나면 문답 답변으로 케이크를 골라 순번과 함께 저장하고 결과 단계로 넘어간다.
  const finish = () => {
    const { setCake, setOrderNumber, goNext } = useExperienceStore.getState();
    setCake(chosenCake());
    setOrderNumber(nextOrderNumber());
    goNext();
  };

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
          <LoadingScene durationMs={loadingMs} onDone={finish} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
