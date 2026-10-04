"use client";

import { useEffect, useState } from "react";
import { ArrowButton } from "@/components/common/ArrowButton/ArrowButton";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { TypedText } from "@/components/common/TypedText/TypedText";
import { CarouselDots } from "@/components/questions/CarouselDots/CarouselDots";
import { ConfettiBurst } from "@/components/questions/ConfettiBurst/ConfettiBurst";
import { ConfirmButton } from "@/components/questions/ConfirmButton/ConfirmButton";
import { PartyBoard } from "@/components/questions/PartyBoard/PartyBoard";
import { FLAVOR_IMAGES } from "@/data/flavors";
import { PARTIES, PARTY_PAPER } from "@/data/parties";
import { preloadImages } from "@/lib/preload";
import { playEffect } from "@/lib/sound";
import { useExperienceStore } from "@/stores/useExperienceStore";

const QUESTION =
  "오늘 이 케이크는 어떤 멋진 장면의 주인공이 될까요?\n테마에 맞춰 특별한 장식들을 준비할게요!";
// 화면이 나타난 뒤 말을 시작하기까지의 뜸.
const TYPING_DELAY_MS = 500;
// 선택하기를 누르면 색종이가 터지는 것을 보여 준 뒤 다음 단계로 넘어간다.
const CONFIRM_SHOW_MS = 1600;

export const PartyScreen = () => {
  const setParty = useExperienceStore((state) => state.setParty);
  const goNext = useExperienceStore((state) => state.goNext);
  // 다음 단계에서 되돌아오면 앞서 고른 테마를 보여 준 채로 시작한다.
  const [active, setActive] = useState(() => {
    const chosen = useExperienceStore.getState().party;
    return Math.max(
      PARTIES.findIndex((item) => item.id === chosen),
      0,
    );
  });
  const [confirming, setConfirming] = useState(false);
  const party = PARTIES[active];

  useEffect(() => {
    preloadImages(FLAVOR_IMAGES);
  }, []);

  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(goNext, CONFIRM_SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [confirming, goNext]);

  const show = (index: number) => {
    const count = PARTIES.length;
    const next = ((index % count) + count) % count;
    if (next === active || confirming) return;
    playEffect("cardSlide");
    setActive(next);
  };

  return (
    <section className="absolute inset-0 overflow-hidden bg-[#f2f0e9]">
      <img
        alt=""
        className="absolute inset-0 size-full max-w-none"
        src={PARTY_PAPER}
      />
      <PartyBoard active={party} />
      {/* 카드는 그림이라, 지금 보이는 테마를 화면을 읽어 주는 도구가 읽도록 글로도 알린다. */}
      <output className="sr-only">{`${party.name}. ${party.description}`}</output>
      <SpeechBubble className="absolute left-[51.55px] top-[149px]">
        <TypedText text={QUESTION} startDelayMs={TYPING_DELAY_MS} sound />
      </SpeechBubble>
      <ProgressBar step={3} className="absolute left-[75px] top-[58px]" />
      <ArrowButton
        direction="prev"
        aria-label="이전 카드"
        className="absolute left-[52px] top-[1075px] z-10"
        onClick={() => show(active - 1)}
      />
      <ArrowButton
        direction="next"
        aria-label="다음 카드"
        className="absolute left-[910px] top-[1075px] z-10"
        onClick={() => show(active + 1)}
      />
      <CarouselDots
        labels={PARTIES.map((item) => item.name)}
        active={active}
        onSelect={show}
        className="absolute left-[428px] top-[1616px]"
      />
      <ConfirmButton
        tone="brown"
        className="absolute left-[235px] top-[1774px]"
        onClick={() => {
          if (confirming) return;
          playEffect("popUp");
          setParty(party.id);
          setConfirming(true);
        }}
      >
        선택하기
      </ConfirmButton>
      {confirming && <ConfettiBurst />}
    </section>
  );
};
