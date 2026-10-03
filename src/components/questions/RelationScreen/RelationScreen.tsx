"use client";

import { useEffect, useState } from "react";
import { ArrowButton } from "@/components/common/ArrowButton/ArrowButton";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { TypedText } from "@/components/common/TypedText/TypedText";
import { ConfirmButton } from "@/components/questions/ConfirmButton/ConfirmButton";
import { RelationCard } from "@/components/questions/RelationCard/RelationCard";
import { CARD_SLOTS, RELATIONS, slotOffset } from "@/data/relations";
import { STYLE_FONTS, STYLE_IMAGES } from "@/data/styles";
import { preloadFonts, preloadImages } from "@/lib/preload";
import { playEffect } from "@/lib/sound";
import { useExperienceStore } from "@/stores/useExperienceStore";

const QUESTION = "오늘 어떤 분을 위한 케이크를 구워드릴까요?";
// 화면이 나타난 뒤 말을 시작하기까지의 뜸.
const TYPING_DELAY_MS = 500;

export const RelationScreen = () => {
  const setRelation = useExperienceStore((state) => state.setRelation);
  const goNext = useExperienceStore((state) => state.goNext);
  // 다음 단계에서 되돌아오면 앞서 고른 카드를 가운데에 둔다.
  const [active, setActive] = useState(() => {
    const chosen = useExperienceStore.getState().relation;
    return Math.max(
      RELATIONS.findIndex((item) => item.id === chosen),
      0,
    );
  });
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    preloadImages(STYLE_IMAGES);
    preloadFonts(STYLE_FONTS);
  }, []);

  // 다른 카드로 넘어가면 앞면부터 다시 보여 준다. 이미 가운데에 있는 카드를 고르면 아무 일도 없다.
  const show = (index: number) => {
    const count = RELATIONS.length;
    const next = ((index % count) + count) % count;
    if (next === active) return;
    playEffect("cardSlide");
    setActive(next);
    setFlipped(false);
  };

  return (
    <section className="absolute inset-0 overflow-hidden bg-[#fffaf9]">
      {RELATIONS.map((relation, index) => (
        <img
          key={relation.id}
          alt=""
          className={`absolute inset-0 size-full max-w-none transition-opacity duration-500 motion-reduce:transition-none ${flipped && index === active ? "opacity-100" : "opacity-0"}`}
          src={relation.background}
        />
      ))}
      {/* 뒷면 설명은 그림 안에 있다. 카드를 뒤집는 순간 화면을 읽어 주는 도구가 읽도록 글로도 알린다. */}
      <output className="sr-only">
        {flipped ? RELATIONS[active].description : ""}
      </output>
      <SpeechBubble className="absolute left-[55px] top-[149px]">
        <TypedText text={QUESTION} startDelayMs={TYPING_DELAY_MS} sound />
      </SpeechBubble>
      <ProgressBar step={1} className="absolute left-[75px] top-[58px]" />
      {RELATIONS.map((relation, index) => {
        const offset = slotOffset(index, active);
        const slot = CARD_SLOTS[offset];
        const isActive = offset === 0;
        return (
          <div
            key={relation.id}
            className="absolute left-[190.5px] top-[617px] transition-transform duration-500 motion-reduce:transition-none"
            style={{
              transform: `translate(${slot.x}px, ${slot.y}px) scale(${slot.scale})`,
              zIndex: slot.zIndex,
            }}
          >
            <RelationCard
              relation={relation}
              face={isActive && flipped ? "back" : "front"}
              aria-pressed={isActive ? flipped : undefined}
              onClick={() => {
                if (isActive) {
                  playEffect("cardFlip");
                  setFlipped((value) => !value);
                } else show(index);
              }}
            />
          </div>
        );
      })}
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
      <div className="absolute left-[428px] top-[1616px] h-[58.66px] w-[223.77px]">
        <div
          className={`absolute inset-0 rounded-full bg-taupe transition-opacity duration-500 motion-reduce:transition-none ${flipped ? "opacity-0" : "opacity-80"}`}
        />
        <div
          className={`absolute inset-0 rounded-full bg-blush transition-opacity duration-500 motion-reduce:transition-none ${flipped ? "opacity-80" : "opacity-0"}`}
        />
        {/* 점 사이가 좁아 누르는 영역을 옆으로는 넓힐 수 없다. 위아래로만 넓히고, 같은 조작은 화살표와 옆 카드로도 할 수 있다. */}
        <div className="relative flex size-full items-center justify-center">
          {RELATIONS.map((relation, index) => (
            <button
              key={relation.id}
              type="button"
              aria-label={`${relation.label} 카드 보기`}
              aria-current={index === active}
              className="-my-[14.67px] flex h-[88px] w-[39.73px] items-center justify-center"
              onClick={() => show(index)}
            >
              <span
                className={`block size-[23.4px] rounded-full border-[0.59px] border-cocoa ${index === active ? "bg-cocoa" : "bg-mist"}`}
              />
            </button>
          ))}
        </div>
      </div>
      <ConfirmButton
        className="absolute left-[235px] top-[1774px]"
        onClick={() => {
          setRelation(RELATIONS[active].id);
          goNext();
        }}
      >
        선택하기
      </ConfirmButton>
    </section>
  );
};
