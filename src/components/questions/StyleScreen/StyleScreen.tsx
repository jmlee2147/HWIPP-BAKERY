"use client";

import { useState } from "react";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { TypedText } from "@/components/common/TypedText/TypedText";
import { ConfirmButton } from "@/components/questions/ConfirmButton/ConfirmButton";
import { StyleWindow } from "@/components/questions/StyleWindow/StyleWindow";
import { folderImage, STYLES, type StyleId } from "@/data/styles";
import { playEffect } from "@/lib/sound";
import { useExperienceStore } from "@/stores/useExperienceStore";

const QUESTION =
  "그분의 평소 스타일이나 성격은 어떤 느낌인가요?\n디자인의 힌트가 될 거예요!";
// 화면이 나타난 뒤 말을 시작하기까지의 뜸.
const TYPING_DELAY_MS = 500;

// 폴더는 같은 간격으로 놓인다. 창은 고른 폴더 쪽에서 튀어나온다.
const FOLDER_LEFT = 82;
const FOLDER_GAP = 190.36;
const FOLDER_WIDTH = 143.29;
const FOLDER_CENTER_Y = 583.86;
const WINDOW_LEFT = 52;
const WINDOW_TOP = 677;

export const StyleScreen = () => {
  const setStyle = useExperienceStore((state) => state.setStyle);
  const goNext = useExperienceStore((state) => state.goNext);
  // 다음 단계에서 되돌아오면 앞서 고른 스타일을 연 채로 시작한다.
  const [active, setActive] = useState(() => {
    const chosen = useExperienceStore.getState().style;
    return Math.max(
      STYLES.findIndex((item) => item.id === chosen),
      0,
    );
  });
  const [summaryOpen, setSummaryOpen] = useState(false);
  const style = STYLES[active];

  const show = (id: StyleId) => {
    const next = STYLES.findIndex((item) => item.id === id);
    if (next === active) return;
    playEffect("cardFlip");
    setActive(next);
    setSummaryOpen(false);
  };

  const folderCenter = FOLDER_LEFT + active * FOLDER_GAP + FOLDER_WIDTH / 2;

  return (
    <section className="absolute inset-0 overflow-hidden bg-[#fffaf9]">
      <SpeechBubble className="absolute left-[55px] top-[149px]">
        <TypedText text={QUESTION} startDelayMs={TYPING_DELAY_MS} sound />
      </SpeechBubble>
      <ProgressBar step={2} className="absolute left-[75px] top-[58px]" />
      {STYLES.map((item, index) => (
        <button
          key={item.id}
          type="button"
          aria-label={`${item.name} 폴더`}
          aria-pressed={index === active}
          className="absolute top-[530.68px] h-[106.35px] w-[143.29px] transition-transform duration-100 active:scale-95"
          style={{ left: FOLDER_LEFT + index * FOLDER_GAP }}
          onClick={() => show(item.id)}
        >
          <img
            alt=""
            className="block size-full max-w-none"
            src={folderImage(item.folder, index === active)}
          />
        </button>
      ))}
      <div
        key={style.id}
        className="absolute left-[52px] top-[677px] animate-window-pop motion-reduce:animate-none"
        style={{
          transformOrigin: `${folderCenter - WINDOW_LEFT}px ${FOLDER_CENTER_Y - WINDOW_TOP}px`,
        }}
      >
        <StyleWindow
          recipient={style}
          summaryOpen={summaryOpen}
          onToggleSummary={() => setSummaryOpen((value) => !value)}
          onSelectStyle={show}
        />
      </div>
      <div
        aria-hidden
        className="absolute left-[470.84px] top-[1713px] flex h-[38.34px] w-[146.23px] items-center justify-center gap-[10.67px] rounded-full bg-taupe/80"
      >
        {STYLES.map((item, index) => (
          <span
            key={item.id}
            className={`block size-[15.29px] rounded-full border-[0.39px] border-cocoa ${index === active ? "bg-cocoa" : "bg-mist"}`}
          />
        ))}
      </div>
      <ConfirmButton
        tone="brown"
        className="absolute left-[235px] top-[1774px]"
        onClick={() => {
          setStyle(style.id);
          goNext();
        }}
      >
        선택하기
      </ConfirmButton>
    </section>
  );
};
