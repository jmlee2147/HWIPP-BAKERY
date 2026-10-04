"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { TypedText } from "@/components/common/TypedText/TypedText";
import { ConfirmButton } from "@/components/questions/ConfirmButton/ConfirmButton";
import { ANALYSIS_IMAGES } from "@/data/analysis";
import {
  FLAVOR_CARD_HEIGHT,
  FLAVOR_CARD_PITCH,
  FLAVOR_LIST,
  FLAVOR_WINDOW,
  FLAVORS,
  nearestFlavor,
} from "@/data/flavors";
import { preloadImages } from "@/lib/preload";
import { playEffect } from "@/lib/sound";
import { useExperienceStore } from "@/stores/useExperienceStore";

const QUESTION =
  "마지막으로 제일 중요한 것 !\n맛에 있어서 무조건 피해야 할 조건이 있나요?";
// 화면이 나타난 뒤 말을 시작하기까지의 뜸.
const TYPING_DELAY_MS = 500;

// 목록 이미지에는 그림자 여백이 붙어 있다. 카드 묶음의 왼쪽 위가 기준점에 오도록 그만큼 당겨 놓는다.
const LIST_PAD_X = 27.3;
const LIST_PAD_Y = 21.3;
// 강조 카드 그림은 카드 사이 틈의 가운데에서 잘라 둔 것이라, 카드보다 22px 위에서 시작한다.
const ACTIVE_LEAD = 22;
const SNAP_SECONDS = 0.45;

export const FlavorScreen = () => {
  const setFlavor = useExperienceStore((state) => state.setFlavor);
  const goNext = useExperienceStore((state) => state.goNext);
  const reduceMotion = useReducedMotion();
  // 다음 단계에서 되돌아오면 앞서 고른 카드를 강조한 채로 시작한다.
  const [active, setActive] = useState(() => {
    const chosen = useExperienceStore.getState().flavor;
    return Math.max(
      FLAVORS.findIndex((item) => item.id === chosen),
      0,
    );
  });
  const listY = useMotionValue(FLAVORS[active].listY);
  // 끌어서 움직인 직후에는 손을 뗀 자리의 카드가 눌린 것으로 치지 않는다.
  const dragged = useRef(false);
  // 목록 그림을 받지 못하면 카드 문구를 글자로 보여 줘서 고를 수 있게 한다.
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    preloadImages(ANALYSIS_IMAGES);
  }, []);

  const settle = (index: number) => {
    if (reduceMotion) listY.set(FLAVORS[index].listY);
    else {
      animate(listY, FLAVORS[index].listY, {
        duration: SNAP_SECONDS,
        ease: "easeOut",
      });
    }
  };

  const select = (index: number) => {
    if (index !== active) playEffect("cardSlide");
    setActive(index);
    settle(index);
  };

  return (
    <section className="absolute inset-0 overflow-hidden bg-[#fffefa]">
      <SpeechBubble className="absolute left-[51.55px] top-[149px]">
        <TypedText text={QUESTION} startDelayMs={TYPING_DELAY_MS} sound />
      </SpeechBubble>
      <ProgressBar step={4} className="absolute left-[75px] top-[58px]" />
      <img
        alt=""
        className="absolute left-[66px] top-[504px] h-[1241px] w-[945px] max-w-none"
        src={FLAVOR_WINDOW}
      />
      {/* 창 그림 안의 목록 자리를 덮고, 그 안에서 실제 목록을 움직인다. */}
      <div className="absolute left-[124px] top-[689px] h-[1015px] w-[831px] overflow-hidden bg-white">
        <motion.div
          className="absolute left-[57px] top-[-2px] h-[1862px] w-[716px] touch-none will-change-transform"
          style={{ y: listY }}
          drag="y"
          dragConstraints={{
            top: FLAVORS[FLAVORS.length - 1].listY,
            bottom: FLAVORS[0].listY,
          }}
          dragElastic={0.15}
          dragMomentum={false}
          onDragStart={() => {
            dragged.current = true;
          }}
          // 끄는 동안에는 걸리는 자리에 가장 가까운 카드가 바로 강조된다.
          onDrag={() => {
            const nearest = nearestFlavor(listY.get());
            if (nearest !== active) {
              playEffect("cardSlide");
              setActive(nearest);
            }
          }}
          onDragEnd={() => {
            settle(nearestFlavor(listY.get()));
            window.setTimeout(() => {
              dragged.current = false;
            }, 0);
          }}
        >
          <img
            alt=""
            className="absolute block h-[1886px] w-[776px] max-w-none"
            src={FLAVOR_LIST}
            style={{ left: -LIST_PAD_X, top: -LIST_PAD_Y }}
            onError={() => setImageFailed(true)}
          />
          {FLAVORS.map((item, index) => (
            <img
              key={item.id}
              alt=""
              className={`absolute block w-[776px] max-w-none transition-opacity duration-300 motion-reduce:transition-none ${index === active ? "opacity-100" : "opacity-0"}`}
              src={item.activeImage}
              style={{
                left: -LIST_PAD_X,
                top:
                  index === 0
                    ? -LIST_PAD_Y
                    : index * FLAVOR_CARD_PITCH - ACTIVE_LEAD,
              }}
            />
          ))}
          {FLAVORS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-pressed={index === active}
              className={`absolute left-0 w-full ${imageFailed ? `px-[48px] font-stardust text-[34px] font-bold leading-[48px] ${index === active ? "bg-cocoa text-petal" : "bg-blush text-cocoa"}` : ""}`}
              style={{
                top: index * FLAVOR_CARD_PITCH,
                height: FLAVOR_CARD_HEIGHT,
              }}
              onClick={() => {
                if (!dragged.current) select(index);
              }}
            >
              {imageFailed ? item.label : null}
            </button>
          ))}
        </motion.div>
        <div
          aria-hidden
          className="absolute left-[810px] top-[-2px] h-[264.34px] w-[14px] rounded-full border-2 border-[#a4a4a5] bg-[#f1f9ff] transition-transform duration-300 motion-reduce:transition-none"
          style={{ transform: `translateY(${FLAVORS[active].thumbY}px)` }}
        />
      </div>
      {/* 카드는 그림이라, 지금 강조된 조건을 화면을 읽어 주는 도구가 읽도록 글로도 알린다. */}
      <output className="sr-only">{FLAVORS[active].label}</output>
      <ConfirmButton
        tone="brown"
        className="absolute left-[235px] top-[1774px]"
        onClick={() => {
          setFlavor(FLAVORS[active].id);
          goNext();
        }}
      >
        선택하기
      </ConfirmButton>
    </section>
  );
};
