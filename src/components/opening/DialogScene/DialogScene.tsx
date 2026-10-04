"use client";

import { type ReactNode, useState } from "react";
import { Baker } from "@/components/common/Baker/Baker";
import {
  ProgressBar,
  type ProgressStep,
} from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { StickerGroup } from "@/components/common/StickerGroup/StickerGroup";
import { TypedText } from "@/components/common/TypedText/TypedText";
import type { DialogSceneData } from "@/data/opening";

// 장면이 나타난 뒤 말을 시작하기까지의 뜸.
const TYPING_DELAY_MS = 500;

interface DialogSceneProps {
  scene: DialogSceneData;
  // 주면 진행 바를 함께 보여 주고, 말풍선을 그 아래로 내린다.
  progressStep?: ProgressStep;
  // 선택지가 없는 장면은 화면 어디를 눌러도 다음으로 넘어간다. 글자가 다 나오기 전에 누르면 글자부터 마저 보여 준다.
  onAdvance?: () => void;
  children?: ReactNode;
}

// 장면마다 key를 달아 써야 한다. 타이핑 상태가 다음 장면으로 넘어가지 않게 하기 위해서다.
export const DialogScene = ({
  scene,
  progressStep,
  onAdvance,
  children,
}: DialogSceneProps) => {
  const [typed, setTyped] = useState(false);
  const [skipTyping, setSkipTyping] = useState(false);

  const handleTap = () => {
    if (typed) onAdvance?.();
    else setSkipTyping(true);
  };

  return (
    <section className="absolute inset-0 overflow-hidden bg-[#ffeff3]">
      <img
        alt=""
        className="absolute max-w-none opacity-70"
        src="/assets/backgrounds/shop.jpg"
        style={scene.background}
      />
      <SpeechBubble
        className={
          progressStep
            ? "absolute left-[51.55px] top-[149px]"
            : "absolute left-[59px] top-[62px]"
        }
      >
        <TypedText
          text={scene.text}
          instant={skipTyping}
          startDelayMs={TYPING_DELAY_MS}
          sound
          onDone={() => setTyped(true)}
        />
      </SpeechBubble>
      {progressStep && (
        <ProgressBar
          step={progressStep}
          className="absolute left-[75px] top-[58px]"
        />
      )}
      {scene.stickers.map((group, index) => (
        <StickerGroup
          key={`${group[0].centerX}-${group[0].centerY}`}
          stickers={group}
          motion="wobble"
          popOrder={scene.popIn ? index : undefined}
          phase={index}
        />
      ))}
      <Baker frames={scene.baker} />
      {onAdvance && (
        <button
          type="button"
          aria-label="다음"
          className="absolute inset-0"
          onClick={handleTap}
        />
      )}
      {children}
    </section>
  );
};
