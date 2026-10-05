"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ChoiceButton } from "@/components/common/ChoiceButton/ChoiceButton";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { TypedText } from "@/components/common/TypedText/TypedText";
import { OrderCard } from "@/components/result/OrderCard/OrderCard";
import { DEFAULT_CAKE } from "@/data/cake";
import {
  RESULT_CHOICES,
  RESULT_TEXT,
  SHOWCASE,
  SHOWCASE_IMAGE,
} from "@/data/result";
import { formatOrderDate, formatOrderNumber } from "@/lib/order";
import { playEffect } from "@/lib/sound";
import { useExperienceStore } from "@/stores/useExperienceStore";

// 화면이 나타난 뒤 말을 시작하기까지의 뜸.
const TYPING_DELAY_MS = 500;

// 카드는 화면이 바뀐 뒤 뒷면에서 앞면으로 뒤집히며 나타난다.
const FLIP_DELAY_SECONDS = 0.5;
const FLIP_SECONDS = 0.9;
const FLIP = {
  initial: { rotateY: -180, scale: 0.8 },
  animate: { rotateY: 0, scale: 1 },
  transition: {
    duration: FLIP_SECONDS,
    delay: FLIP_DELAY_SECONDS,
    ease: "easeOut",
  },
} as const;
const FACE = "[backface-visibility:hidden]";

export const ResultScreen = () => {
  // 단계를 건너뛰어 케이크나 순번이 없는 채로 들어와도 기본 케이크와 첫 번호로 화면을 채운다.
  const cake = useExperienceStore((state) => state.cake) ?? DEFAULT_CAKE;
  const orderNumber = useExperienceStore((state) => state.orderNumber) ?? 1;
  const goTo = useExperienceStore((state) => state.goTo);
  const [date] = useState(() => formatOrderDate(new Date()));

  useEffect(() => {
    const timer = window.setTimeout(
      () => playEffect("cardFlip"),
      FLIP_DELAY_SECONDS * 1000,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="absolute inset-0 overflow-hidden bg-[#ffeff3]">
      <img
        alt=""
        className="absolute max-w-none opacity-[0.45]"
        src={SHOWCASE_IMAGE}
        style={SHOWCASE}
      />
      <SpeechBubble className="absolute left-[51.55px] top-[149px]">
        <TypedText text={RESULT_TEXT} startDelayMs={TYPING_DELAY_MS} sound />
      </SpeechBubble>
      <ProgressBar step={4} className="absolute left-[75px] top-[58px]" />
      {/* 투명도를 뒤집히는 요소에 직접 주면 앞뒷면이 한 장으로 합쳐져 뒷면이 비친다. 바깥에서 따로 준다. */}
      <motion.div
        className="absolute left-[175px] top-[511px] [perspective:2400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: FLIP_DELAY_SECONDS }}
      >
        <motion.div
          className="relative [transform-style:preserve-3d]"
          initial={FLIP.initial}
          animate={FLIP.animate}
          transition={FLIP.transition}
        >
          <OrderCard
            className={FACE}
            cake={cake}
            date={date}
            orderNumber={formatOrderNumber(orderNumber)}
          />
          <div
            aria-hidden
            className={`absolute inset-0 bg-mist shadow-[4px_7px_8px_0px_rgba(0,0,0,0.15)] [transform:rotateY(180deg)] ${FACE}`}
          >
            <div className="absolute inset-x-[27px] bottom-[31px] top-[24px] border-[0.73px] border-[#c2c2c2] bg-[#fdfcf9]" />
          </div>
        </motion.div>
      </motion.div>
      <ChoiceButton
        tone="pink"
        className="absolute left-[62px] top-[1579px]"
        onClick={() => goTo("editor")}
      >
        {RESULT_CHOICES.edit}
      </ChoiceButton>
      <ChoiceButton
        tone="cocoa"
        className="absolute left-[62px] top-[1724px]"
        onClick={() => goTo("share")}
      >
        {RESULT_CHOICES.keep}
      </ChoiceButton>
    </section>
  );
};
