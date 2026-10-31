"use client";

import { AnimatePresence, motion } from "motion/react";
import { type ComponentType, useEffect } from "react";
import { AnalysisScreen } from "@/components/analysis/AnalysisScreen/AnalysisScreen";
import { HomeButton } from "@/components/common/HomeButton/HomeButton";
import { EditorScreen } from "@/components/editor/EditorScreen/EditorScreen";
import { StepPlaceholder } from "@/components/experience/StepPlaceholder/StepPlaceholder";
import { OpeningScreen } from "@/components/opening/OpeningScreen/OpeningScreen";
import { FlavorScreen } from "@/components/questions/FlavorScreen/FlavorScreen";
import { PartyScreen } from "@/components/questions/PartyScreen/PartyScreen";
import { RelationScreen } from "@/components/questions/RelationScreen/RelationScreen";
import { StyleScreen } from "@/components/questions/StyleScreen/StyleScreen";
import { MenuScreen } from "@/components/result/MenuScreen/MenuScreen";
import { ResultScreen } from "@/components/result/ResultScreen/ResultScreen";
import { ShareScreen } from "@/components/share/ShareScreen/ShareScreen";
import { useIdleReset } from "@/hooks/common/useIdleReset";
import { markStep, remeasureStep, startRun } from "@/lib/diagnostics";
import { FIRST_STEP, type Step } from "@/lib/steps";
import { coverEnter, holdUntilCovered } from "@/lib/transitions";
import { useExperienceStore } from "@/stores/useExperienceStore";

const IDLE_RESET_MS = 40_000;
// 화면을 그린 뒤 그림이 모두 받아지기를 기다렸다가 다시 재는 시간.
const SETTLE_MS = 3000;

// 구현이 끝난 단계의 화면. 여기에 없는 단계는 임시 화면으로 이어 준다.
const SCREENS: Partial<Record<Step, ComponentType>> = {
  opening: OpeningScreen,
  relation: RelationScreen,
  style: StyleScreen,
  party: PartyScreen,
  flavor: FlavorScreen,
  analysis: AnalysisScreen,
  result: ResultScreen,
  menu: MenuScreen,
  editor: EditorScreen,
  share: ShareScreen,
};

// 처음으로 버튼을 두는 단계. 아래쪽을 전체 폭 버튼이 차지하는 화면에는 두지 않는다.
// 오프닝 안의 장면은 OpeningScreen이 따로 정한다.
const HOME_STEPS: Step[] = ["relation", "style", "party", "flavor"];

export const ExperienceRoot = () => {
  const { step, goNext, goPrev, reset } = useExperienceStore();

  const Screen = SCREENS[step];

  useIdleReset(IDLE_RESET_MS, reset, step !== FIRST_STEP);

  // 휴대폰 브라우저가 체험 도중 페이지를 닫는 일이 있어, 어디까지 갔는지 남긴다. /device에서 본다.
  useEffect(() => {
    startRun();
  }, []);

  // 들어설 때 먼저 남기고, 화면을 다 그린 뒤에 재서 남긴다. 그리는 도중에 닫히면 "열림"만 남아
  // 그 화면을 그리다 닫혔음을 알 수 있다. 그림이 받아질 시간을 준 뒤 한 번 더 재서 값을 올린다.
  useEffect(() => {
    markStep(step, "열림");
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => markStep(step, "그려짐"));
    });
    const settle = window.setTimeout(() => remeasureStep(step), SETTLE_MS);
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      window.clearTimeout(settle);
    };
  }, [step]);

  return (
    <>
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
      {HOME_STEPS.includes(step) && (
        <HomeButton
          className="absolute left-[65px] top-[1772px] z-10"
          onHome={reset}
        />
      )}
    </>
  );
};
