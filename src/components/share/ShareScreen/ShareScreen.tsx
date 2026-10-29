"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ChoiceButton } from "@/components/common/ChoiceButton/ChoiceButton";
import { ConfirmButton } from "@/components/common/ConfirmButton/ConfirmButton";
import { ConfirmDialog } from "@/components/common/ConfirmDialog/ConfirmDialog";
import { GlowBackground } from "@/components/common/GlowBackground/GlowBackground";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { TypedText } from "@/components/common/TypedText/TypedText";
import { CakeBox } from "@/components/result/CakeBox/CakeBox";
import { KeywordTags } from "@/components/result/KeywordTags/KeywordTags";
import { QrCode } from "@/components/share/QrCode/QrCode";
import { DEFAULT_CAKE } from "@/data/cake";
import {
  BYE_CHOICES,
  BYE_MESSAGE,
  FINAL_BOX_POSITION,
  FINAL_CHOICES,
  FINAL_FLAVOR_SUFFIX,
  FINAL_GLOWS,
  FINAL_KEYWORD_TAGS,
  FINAL_TEXT,
  PEEK_BAKER,
  QR_CODE,
  QR_FRAME,
  QR_GLOWS,
  QR_HINT,
  QR_HOME,
  QR_TEXT,
  QR_TIMEOUT_MS,
  QR_TIP,
  TIP_BUBBLE,
  TIP_BUBBLE_IMAGE,
  TIP_TEXT_CENTER,
} from "@/data/share";
import { formatOrderDate, formatOrderNumber } from "@/lib/order";
import { type SharedCake, shareUrl } from "@/lib/share";
import { playEffect } from "@/lib/sound";
import { coverEnter, holdUntilCovered } from "@/lib/transitions";
import { useExperienceStore } from "@/stores/useExperienceStore";

export type ShareScene = "final" | "qr";

// 화면이 나타난 뒤 말을 시작하기까지의 뜸.
const TYPING_DELAY_MS = 500;

interface ShareScreenProps {
  initialScene?: ShareScene;
}

export const ShareScreen = ({ initialScene = "final" }: ShareScreenProps) => {
  const cake = useExperienceStore((state) => state.cake) ?? DEFAULT_CAKE;
  const orderNumber = useExperienceStore((state) => state.orderNumber) ?? 1;
  const party = useExperienceStore((state) => state.party);
  const style = useExperienceStore((state) => state.style);
  const relation = useExperienceStore((state) => state.relation);
  const flavor = useExperienceStore((state) => state.flavor);
  const reset = useExperienceStore((state) => state.reset);
  const [scene, setScene] = useState<ShareScene>(initialScene);
  const [asking, setAsking] = useState(false);
  const [date] = useState(() => formatOrderDate(new Date()));
  const [url, setUrl] = useState<string | null>(null);

  const shared: SharedCake = {
    cake,
    answers: { party, style, relation, flavor },
    date,
    orderNumber,
  };

  // QR 화면은 누르든 말든 정해진 시간이 지나면 다음 관람객을 위해 처음으로 돌아간다.
  useEffect(() => {
    if (scene !== "qr") return;
    const timer = window.setTimeout(reset, QR_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [scene, reset]);

  // 주소는 압축해서 만들어 조금 늦게 나온다. 그동안 QR 자리는 흰 틀만 보인다.
  // biome-ignore lint/correctness/useExhaustiveDependencies: 이 화면에 머무는 동안 케이크와 답변은 바뀌지 않는다.
  useEffect(() => {
    if (scene !== "qr") return;
    let active = true;
    shareUrl(window.location.origin, shared).then((next) => {
      if (active) setUrl(next);
    });
    return () => {
      active = false;
    };
  }, [scene]);

  const askHome = () => {
    playEffect("popUp");
    setAsking(true);
  };

  const renderScene = () => {
    if (scene === "final") {
      return (
        <section className="absolute inset-0 overflow-hidden">
          <GlowBackground glows={FINAL_GLOWS} />
          <CakeBox
            className="absolute"
            style={FINAL_BOX_POSITION}
            cake={cake}
            date={date}
            orderNumber={formatOrderNumber(orderNumber)}
          />
          <KeywordTags
            answers={shared.answers}
            flavorSuffix={FINAL_FLAVOR_SUFFIX}
            slots={FINAL_KEYWORD_TAGS}
          />
          <SpeechBubble className="absolute left-[51.55px] top-[149px]">
            <TypedText text={FINAL_TEXT} startDelayMs={TYPING_DELAY_MS} sound />
          </SpeechBubble>
          <ProgressBar
            step="complete"
            className="absolute left-[75px] top-[58px]"
          />
          <ChoiceButton
            tone="mint"
            size="half"
            className="absolute left-[62px] top-[1736px]"
            onClick={askHome}
          >
            {FINAL_CHOICES.home}
          </ChoiceButton>
          <ChoiceButton
            tone="cocoa"
            size="half"
            className="absolute left-[546px] top-[1736px]"
            onClick={() => setScene("qr")}
          >
            {FINAL_CHOICES.qr}
          </ChoiceButton>
        </section>
      );
    }

    return (
      <section className="absolute inset-0 overflow-hidden">
        <GlowBackground glows={QR_GLOWS} />
        <div
          className="absolute border-2 border-chocolate bg-white"
          style={{
            left: QR_FRAME.left,
            top: QR_FRAME.top,
            width: QR_FRAME.size,
            height: QR_FRAME.size,
          }}
        />
        {url && (
          <QrCode
            value={url}
            label="케이크 저장 페이지로 가는 QR 코드"
            className="absolute text-candy"
            style={{
              left: QR_CODE.left,
              top: QR_CODE.top,
              width: QR_CODE.size,
              height: QR_CODE.size,
            }}
          />
        )}
        {/* 바깥은 들어오는 움직임, 가운데는 들어온 뒤 갸웃거림, 안쪽 그림은 고정된 기울기를 맡는다. */}
        <div
          aria-hidden
          className="absolute animate-peek-in motion-reduce:animate-none"
          style={PEEK_BAKER.box}
        >
          <div className="size-full animate-sway [animation-delay:3.8s] motion-reduce:animate-none">
            <img
              alt=""
              className="block size-full max-w-none"
              src={PEEK_BAKER.src}
              style={{ transform: `rotate(${PEEK_BAKER.rotate}deg)` }}
            />
          </div>
        </div>
        {/* 캐릭터가 다 나온 뒤에 말풍선이 꼬리 쪽에서부터 튀어나온다. */}
        <div className="absolute inset-0 origin-[262px_1529px] animate-pop-in [animation-delay:3.8s] motion-reduce:animate-none">
          <img
            alt=""
            className="absolute block max-w-none"
            src={TIP_BUBBLE_IMAGE}
            style={TIP_BUBBLE}
          />
          <p
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-pre text-center font-stardust text-[30.08px] font-bold leading-[39px] tracking-[-0.75px] text-cocoa"
            style={{ left: TIP_TEXT_CENTER.x, top: TIP_TEXT_CENTER.y }}
          >
            {QR_TIP}
          </p>
        </div>
        <SpeechBubble
          hint={QR_HINT}
          className="absolute left-[51.55px] top-[149px]"
        >
          <TypedText text={QR_TEXT} startDelayMs={TYPING_DELAY_MS} sound />
        </SpeechBubble>
        <ProgressBar
          step="complete"
          className="absolute left-[75px] top-[58px]"
        />
        <ChoiceButton
          tone="cocoa"
          className="absolute left-[62px] top-[1724px]"
          onClick={askHome}
        >
          {QR_HOME}
        </ChoiceButton>
      </section>
    );
  };

  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={scene}
          className="absolute inset-0"
          initial={coverEnter.initial}
          animate={coverEnter.animate}
          exit={holdUntilCovered}
        >
          {renderScene()}
        </motion.div>
      </AnimatePresence>
      {asking && (
        // 팝업이 떠 있는 동안에는 뒤 화면을 누를 수 없다.
        <div className="absolute inset-0 z-20">
          <ConfirmDialog
            message={BYE_MESSAGE}
            className="absolute left-[129px] top-[777px] origin-[-18px_1041px] animate-window-pop motion-reduce:animate-none"
          >
            <ConfirmButton
              tone="gray"
              size="half"
              onClick={() => setAsking(false)}
            >
              {BYE_CHOICES.stay}
            </ConfirmButton>
            <ConfirmButton tone="pink" size="half" onClick={reset}>
              {BYE_CHOICES.leave}
            </ConfirmButton>
          </ConfirmDialog>
        </div>
      )}
    </>
  );
};
