"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ChoiceButton } from "@/components/common/ChoiceButton/ChoiceButton";
import { GlowBackground } from "@/components/common/GlowBackground/GlowBackground";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { TypedText } from "@/components/common/TypedText/TypedText";
import { CakeBox } from "@/components/result/CakeBox/CakeBox";
import { KeywordTags } from "@/components/result/KeywordTags/KeywordTags";
import { DEFAULT_CAKE } from "@/data/cake";
import { EDITOR_IMAGES } from "@/data/editor";
import { MENU_PRELOAD } from "@/data/menu";
import {
  RESULT_BOX_POSITION,
  RESULT_CHOICES,
  RESULT_FLAVOR_SUFFIX,
  RESULT_GLOWS,
  RESULT_KEYWORD_TAGS,
  RESULT_TEXT,
} from "@/data/result";
import { SHARE_IMAGES } from "@/data/share";
import { formatOrderDate, formatOrderNumber } from "@/lib/order";
import { preloadImages } from "@/lib/preload";
import { useExperienceStore } from "@/stores/useExperienceStore";

// 화면이 나타난 뒤 말을 시작하기까지의 뜸.
const TYPING_DELAY_MS = 500;

// 상자는 화면이 바뀐 뒤 살짝 커지며 나타나고, 키워드는 그 뒤에 붙는다.
const BOX_DELAY_SECONDS = 0.5;
const TAGS_DELAY_SECONDS = 1;

export const ResultScreen = () => {
  // 단계를 건너뛰어 케이크나 순번이 없는 채로 들어와도 기본 케이크와 첫 번호로 화면을 채운다.
  const cake = useExperienceStore((state) => state.cake) ?? DEFAULT_CAKE;
  const orderNumber = useExperienceStore((state) => state.orderNumber) ?? 1;
  const party = useExperienceStore((state) => state.party);
  const style = useExperienceStore((state) => state.style);
  const relation = useExperienceStore((state) => state.relation);
  const flavor = useExperienceStore((state) => state.flavor);
  const goTo = useExperienceStore((state) => state.goTo);
  const [date] = useState(() => formatOrderDate(new Date()));

  useEffect(() => {
    preloadImages([...EDITOR_IMAGES, ...SHARE_IMAGES, ...MENU_PRELOAD]);
  }, []);

  return (
    <section className="absolute inset-0 overflow-hidden bg-[#ffeff3]">
      <GlowBackground glows={RESULT_GLOWS} />
      <motion.div
        className="absolute"
        style={RESULT_BOX_POSITION}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: BOX_DELAY_SECONDS,
          ease: "easeOut",
        }}
      >
        <CakeBox
          cake={cake}
          date={date}
          orderNumber={formatOrderNumber(orderNumber)}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: TAGS_DELAY_SECONDS }}
      >
        <KeywordTags
          answers={{ party, style, relation, flavor }}
          flavorSuffix={RESULT_FLAVOR_SUFFIX}
          slots={RESULT_KEYWORD_TAGS}
        />
      </motion.div>
      <SpeechBubble className="absolute left-[51.55px] top-[149px]">
        <TypedText text={RESULT_TEXT} startDelayMs={TYPING_DELAY_MS} sound />
      </SpeechBubble>
      <ProgressBar step={4} className="absolute left-[75px] top-[58px]" />
      <ChoiceButton
        tone="mint"
        size="half"
        className="absolute left-[62px] top-[1579px]"
        onClick={() => goTo("menu")}
      >
        {RESULT_CHOICES.menu}
      </ChoiceButton>
      <ChoiceButton
        tone="pink"
        size="half"
        className="absolute left-[546px] top-[1579px]"
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
