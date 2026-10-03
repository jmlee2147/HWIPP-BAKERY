"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ChoiceButton } from "@/components/common/ChoiceButton/ChoiceButton";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { TypedText } from "@/components/common/TypedText/TypedText";
import { DialogScene } from "@/components/opening/DialogScene/DialogScene";
import { StoreSign } from "@/components/opening/StoreSign/StoreSign";
import { TitleScene } from "@/components/opening/TitleScene/TitleScene";
import { GREETING, INTRO_1, INTRO_2, QUESTION } from "@/data/opening";
import { useIdleReset } from "@/hooks/common/useIdleReset";
import { playEffect, preloadSounds, startBgm, stopBgm } from "@/lib/sound";
import { coverEnter, FADE_SECONDS, holdUntilCovered } from "@/lib/transitions";
import { useExperienceStore } from "@/stores/useExperienceStore";

export type OpeningScene =
  | "title"
  | "store"
  | "greeting"
  | "intro1"
  | "intro2"
  | "question";

const IDLE_RESET_MS = 120_000;
// 문이 열리는 데 0.5초, 열린 모습을 보여 주는 데 1.5초.
const DOOR_OPEN_MS = 2000;

const STORE_TEXT =
  "어? 여기 새로 생긴 디저트 가게인가?\n맛있어 보인다. 한 번 들어가 볼까?";

const upperChoice = "absolute left-[62px] top-[1559.4px]";
const lowerChoice = "absolute left-[62px] top-[1723.6px]";

interface OpeningScreenProps {
  initialScene?: OpeningScene;
}

export const OpeningScreen = ({
  initialScene = "title",
}: OpeningScreenProps) => {
  const goTo = useExperienceStore((state) => state.goTo);
  const [scene, setScene] = useState<OpeningScene>(initialScene);
  const [doorOpen, setDoorOpen] = useState(false);

  useIdleReset(
    IDLE_RESET_MS,
    () => {
      setDoorOpen(false);
      setScene("title");
    },
    scene !== "title",
  );

  useEffect(() => {
    preloadSounds();
  }, []);

  // 타이틀은 다음 관람객을 기다리는 화면이다. 어떤 경로로 돌아왔든 배경음악을 멈춘다.
  useEffect(() => {
    if (scene === "title") stopBgm();
  }, [scene]);

  useEffect(() => {
    if (!doorOpen) return;
    const timer = window.setTimeout(() => {
      setDoorOpen(false);
      setScene("greeting");
    }, DOOR_OPEN_MS);
    return () => window.clearTimeout(timer);
  }, [doorOpen]);

  const renderScene = () => {
    if (scene === "title") {
      return (
        <TitleScene
          onStart={() => {
            playEffect("choice");
            startBgm();
            setScene("store");
          }}
        />
      );
    }

    if (scene === "store") {
      return (
        <section className="absolute inset-0 overflow-hidden bg-[#c8a7a1]">
          <img
            alt=""
            className="absolute inset-0 size-full max-w-none object-cover"
            src="/assets/backgrounds/store-closed.jpg"
          />
          <div
            className={`absolute left-[145.6px] top-[811px] h-[730.5px] w-[346.8px] transition-opacity duration-500 [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)] ${doorOpen ? "opacity-100" : "opacity-0"}`}
          >
            <div className="size-full bg-[#fff9f1] [mask-image:linear-gradient(transparent,#000_3%,#000_97%,transparent)]">
              <img
                alt=""
                className="size-full max-w-none opacity-[0.51]"
                src="/assets/backgrounds/store-door-open.jpg"
              />
            </div>
          </div>
          <SpeechBubble className="absolute left-[59px] top-[62px]">
            <TypedText text={STORE_TEXT} startDelayMs={500} />
          </SpeechBubble>
          <StoreSign className="absolute left-[356px] top-[462px]" />
          <p className="absolute left-0 top-[1718px] w-full text-center font-stardust text-[40px] font-bold leading-[93px] tracking-[-0.025em] text-white [text-shadow:1px_1px_7.7px_#c12f7d]">
            화면을 터치해 들어가기
          </p>
          <button
            type="button"
            aria-label="가게에 들어가기"
            className="absolute inset-0"
            disabled={doorOpen}
            onClick={() => {
              playEffect("doorBell");
              playEffect("doorOpen");
              setDoorOpen(true);
            }}
          />
        </section>
      );
    }

    if (scene === "greeting") {
      return (
        <DialogScene key="greeting" scene={GREETING}>
          <ChoiceButton
            tone="pink"
            className={upperChoice}
            onClick={() => setScene("intro1")}
          >
            아니요. 예약 안 했어요.
          </ChoiceButton>
          <ChoiceButton
            tone="mint"
            className={lowerChoice}
            onClick={() => setScene("intro1")}
          >
            여기는 뭐하는 곳이에요?
          </ChoiceButton>
        </DialogScene>
      );
    }

    if (scene === "intro1") {
      return (
        <DialogScene
          key="intro1"
          scene={INTRO_1}
          onAdvance={() => setScene("intro2")}
        />
      );
    }

    if (scene === "intro2") {
      return (
        <DialogScene
          key="intro2"
          scene={INTRO_2}
          onAdvance={() => setScene("question")}
        />
      );
    }

    return (
      <DialogScene key="question" scene={QUESTION}>
        <ChoiceButton
          tone="pink"
          className={upperChoice}
          onClick={() => goTo("relation")}
        >
          좋아! 내가 선물하고 싶은 상대는 ...
        </ChoiceButton>
        <ChoiceButton
          tone="mint"
          className={lowerChoice}
          onClick={() => goTo("editor")}
        >
          내가 바로 직접 디자인 해볼래
        </ChoiceButton>
      </DialogScene>
    );
  };

  // 가게 앞에서는 다음 장면이 덮이는 동안 문 쪽으로 다가간다.
  const exit =
    scene === "store"
      ? {
          ...holdUntilCovered,
          scale: 1.7,
          transition: {
            ...holdUntilCovered.transition,
            scale: { duration: FADE_SECONDS },
          },
        }
      : holdUntilCovered;

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={scene}
        className="absolute inset-0 origin-[319px_1176px]"
        initial={coverEnter.initial}
        animate={coverEnter.animate}
        exit={exit}
      >
        {renderScene()}
      </motion.div>
    </AnimatePresence>
  );
};
