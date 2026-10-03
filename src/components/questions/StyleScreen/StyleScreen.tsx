"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { TypedText } from "@/components/common/TypedText/TypedText";
import { ConfirmButton } from "@/components/questions/ConfirmButton/ConfirmButton";
import { StyleWindow } from "@/components/questions/StyleWindow/StyleWindow";
import { PARTY_IMAGES } from "@/data/parties";
import { folderImage, STYLES, type StyleId } from "@/data/styles";
import { preloadImages } from "@/lib/preload";
import { playEffect } from "@/lib/sound";
import { useExperienceStore } from "@/stores/useExperienceStore";

const QUESTION =
  "그분의 평소 스타일이나 성격은 어떤 느낌인가요?\n디자인의 힌트가 될 거예요!";
// 화면이 나타난 뒤 말을 시작하기까지의 뜸.
const TYPING_DELAY_MS = 500;
// 한 줄 요약 창은 스타일 창이 뜰 때 한 번 보였다가 사라진다.
const SUMMARY_SHOW_MS = 2500;
// 스타일 창이 다 뜬 다음에 요약 창이 나오도록 조금 기다린다.
const SUMMARY_DELAY_MS = 600;
// 선택하기를 누르면 요약 창을 한 번 더 보여 준 뒤 다음 단계로 넘어간다.
const CONFIRM_SHOW_MS = 1400;

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
  // 말풍선의 말이 끝나기 전에는 요약 창을 띄우지 않는다.
  const [typed, setTyped] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const style = STYLES[active];

  useEffect(() => {
    preloadImages(PARTY_IMAGES);
  }, []);

  // 말이 끝난 뒤, 그리고 스타일을 바꿀 때마다(active가 바뀐다) 잠시 뒤 요약 창이 한 번 뜬다.
  // biome-ignore lint/correctness/useExhaustiveDependencies: active는 타이머를 다시 시작시키는 용도다
  useEffect(() => {
    if (!typed) return;
    const timer = window.setTimeout(
      () => setSummaryOpen(true),
      SUMMARY_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, typed]);

  // 요약 창이 뜰 때마다 소리를 낸다. 자동으로 뜰 때와 눌러서 띄울 때 모두 해당한다.
  useEffect(() => {
    if (summaryOpen) playEffect("popUp");
  }, [summaryOpen]);

  useEffect(() => {
    if (!summaryOpen || confirming) return;
    const timer = window.setTimeout(
      () => setSummaryOpen(false),
      SUMMARY_SHOW_MS,
    );
    return () => window.clearTimeout(timer);
  }, [summaryOpen, confirming]);

  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(goNext, CONFIRM_SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [confirming, goNext]);

  const show = (id: StyleId) => {
    const next = STYLES.findIndex((item) => item.id === id);
    if (next === active || confirming) return;
    playEffect("cardFlip");
    setActive(next);
    setSummaryOpen(false);
  };

  const folderCenter = FOLDER_LEFT + active * FOLDER_GAP + FOLDER_WIDTH / 2;

  return (
    <section className="absolute inset-0 overflow-hidden bg-[#fffaf9]">
      <SpeechBubble className="absolute left-[55px] top-[149px]">
        <TypedText
          text={QUESTION}
          startDelayMs={TYPING_DELAY_MS}
          sound
          onDone={() => setTyped(true)}
        />
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
          if (confirming) return;
          setStyle(style.id);
          setSummaryOpen(true);
          setConfirming(true);
        }}
      >
        선택하기
      </ConfirmButton>
    </section>
  );
};
