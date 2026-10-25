"use client";

import { useEffect, useState } from "react";
import { ChoiceButton } from "@/components/common/ChoiceButton/ChoiceButton";
import { GlowBackground } from "@/components/common/GlowBackground/GlowBackground";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { CakeBox } from "@/components/result/CakeBox/CakeBox";
import { KeywordTags } from "@/components/result/KeywordTags/KeywordTags";
import {
  FINAL_BOX_POSITION,
  FINAL_FLAVOR_SUFFIX,
  FINAL_GLOWS,
  FINAL_KEYWORD_TAGS,
  FINAL_TEXT,
  SAVE_CHOICE,
  SAVE_FILE_NAME,
  SHARE_BROKEN_TEXT,
} from "@/data/share";
import { drawCakeBoxImage, saveImage } from "@/lib/cakeImage";
import { formatOrderNumber } from "@/lib/order";
import { decodeSharedCake, type SharedCake } from "@/lib/share";

type ViewState =
  | { status: "loading" }
  | { status: "broken" }
  | { status: "ready"; shared: SharedCake };

// 키오스크의 QR 코드로 연 페이지. 주소에 담긴 케이크를 최종 완성 화면처럼 보여 주고 그림으로 저장하게 한다.
export const SharedCakeView = () => {
  const [view, setView] = useState<ViewState>({ status: "loading" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    decodeSharedCake(window.location.hash).then((shared) => {
      if (!active) return;
      setView(shared ? { status: "ready", shared } : { status: "broken" });
    });
    return () => {
      active = false;
    };
  }, []);

  const save = async (shared: SharedCake) => {
    setSaving(true);
    try {
      const blob = await drawCakeBoxImage({
        cake: shared.cake,
        date: shared.date,
        orderNumber: formatOrderNumber(shared.orderNumber),
      });
      await saveImage(blob, SAVE_FILE_NAME);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="absolute inset-0 overflow-hidden">
      <GlowBackground glows={FINAL_GLOWS} />
      {view.status === "ready" && (
        <>
          <CakeBox
            className="absolute"
            style={FINAL_BOX_POSITION}
            cake={view.shared.cake}
            date={view.shared.date}
            orderNumber={formatOrderNumber(view.shared.orderNumber)}
          />
          <KeywordTags
            answers={view.shared.answers}
            flavorSuffix={FINAL_FLAVOR_SUFFIX}
            slots={FINAL_KEYWORD_TAGS}
          />
          <ChoiceButton
            tone="cocoa"
            className="absolute left-[62px] top-[1724px]"
            disabled={saving}
            onClick={() => save(view.shared)}
          >
            {SAVE_CHOICE}
          </ChoiceButton>
        </>
      )}
      {view.status !== "loading" && (
        <SpeechBubble className="absolute left-[51.55px] top-[149px]">
          <span className="whitespace-pre-line">
            {view.status === "ready" ? FINAL_TEXT : SHARE_BROKEN_TEXT}
          </span>
        </SpeechBubble>
      )}
      <ProgressBar
        step="complete"
        className="absolute left-[75px] top-[58px]"
      />
    </section>
  );
};
